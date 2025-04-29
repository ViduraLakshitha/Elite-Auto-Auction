import { useState, useEffect } from "react";
import io from "socket.io-client";

function Notifications() {
  const [userId, setUserId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect to the server using Socket.io when the component mounts
  useEffect(() => {
    const socketInstance = io("http://localhost:5555"); // Change to your server URL if needed
    setSocket(socketInstance);

    // Listen for real-time notifications
    socketInstance.on("notification", (newNotification) => {
      // Update notifications state when a new notification is received
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
    });

    // Cleanup socket connection when component is unmounted
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    if (!userId) {
      alert("Please enter a userId!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/notifications/${userId}`);
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch notifications.");
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5555/notifications/read/${notificationId}`, {
        method: 'PUT',
      });

      // Update the notification state to mark it as read
      setNotifications((prevNotifications) => 
        prevNotifications.map((notification) => 
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to mark notification as read.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🔔 User Notifications</h1>

      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter User ID"
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={fetchNotifications}>Fetch Notifications</button>

      <ul style={{ marginTop: '20px' }}>
        {notifications.map((notification) => (
          <li key={notification._id} style={{ backgroundColor: notification.isRead ? '#e0e0e0' : '#fff' }}>
            <strong>{notification.type.toUpperCase()}</strong> - {notification.message} - 
            {new Date(notification.createdAt).toLocaleString()}
            {!notification.isRead && (
              <button onClick={() => markAsRead(notification._id)} style={{ marginLeft: '10px' }}>
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
