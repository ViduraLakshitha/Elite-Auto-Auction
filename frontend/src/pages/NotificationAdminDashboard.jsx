import React, { useEffect, useState } from "react";
import { getAllNotifications, deleteNotification, updateNotification } from "../api/api"; // Assuming you have these APIs
import axios from 'axios';
import { io } from "socket.io-client"; // Add Socket.IO client
import "./AdminDashboard.css";

const NotificationAdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    isRead: '',
    startDate: '',
    endDate: '',
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Setup socket connection
    const newSocket = io("http://localhost:5555"); // Connect to your server
    setSocket(newSocket);

    // Listen for new notifications
    newSocket.on('newNotification', (newNotification) => {
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = // ✅ Correct (Matches your actual route structure)
        await axios.get('http://localhost:5555/notifications/admin/notifications'); // Full URL to backend
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Use axios.delete instead of axios.get
      await axios.delete(`http://localhost:5555/notifications/admin/notifications/${notificationId}`);
      
      // Update the state to remove the deleted notification
      setNotifications(notifications.filter((n) => n._id !== notificationId));
      
      // Notify the user
      alert("Notification deleted successfully!");
    } catch (error) {
      // Log the error in the console
      console.error("Error deleting notification:", error);
    }
  };
  

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Use axios.patch instead of updateNotification
      await axios.patch(`http://localhost:5555/notifications/admin/notifications/${notificationId}/read`);
      
      // Update the state to mark the notification as read
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
  
      // Notify the user
      alert("Notification marked as read!");
    } catch (error) {
      // Log the error in the console
      console.error("Error marking notification as read:", error);
    }
  };
  

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Unique notification types for filter dropdown
  const notificationTypes = [...new Set(notifications.map(n => n.type))];

  const filteredNotifications = notifications.filter(notification => {
    const { type, isRead, startDate, endDate } = filters;

    if (type && notification.type !== type) return false;
    if (isRead && notification.isRead !== (isRead === 'read')) return false;
    if (startDate && new Date(notification.createdAt) < new Date(startDate)) return false;
    if (endDate && new Date(notification.createdAt) > new Date(endDate)) return false;

    return true;
  });

  const generateReport = () => {
    const headers = ['User ID', 'Message', 'Type', 'Created At', 'Read Status'];
    const rows = filteredNotifications.map(notification => [
      notification.userId,
      notification.message,
      notification.type,
      new Date(notification.createdAt).toLocaleString(),
      notification.isRead ? 'Read' : 'Unread',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notifications_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      <h2>Notification Admin Dashboard</h2>

      {/* Filters Section */}
      <div className="filters">
        <label>Type:</label>
        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All</option>
          {notificationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>Read Status:</label>
        <select name="isRead" value={filters.isRead} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="read">Read</option>
          <option value="unread">Unread</option>
        </select>

        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Notifications Table */}
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Message</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Read Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <tr key={notification._id}>
                <td>{notification.userId}</td>
                <td>{notification.message}</td>
                <td>{notification.type}</td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
                <td>{notification.isRead ? "Read" : "Unread"}</td>
                <td>
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    disabled={notification.isRead}
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No notifications found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Report Generation Button */}
      <button onClick={generateReport} className="generate-report">
        Generate Report
      </button>
    </div>
  );
};

export default NotificationAdminDashboard;
