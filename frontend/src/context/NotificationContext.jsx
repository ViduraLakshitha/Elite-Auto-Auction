// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Replace <USER_ID> with the actual user ID (from your auth system)
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/notifications/<USER_ID>');
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // Connect to Socket.IO server
    const socket = io('http://localhost:5555');

    // Listen for incoming notifications
    socket.on('receiveNotification', (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    // Cleanup the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5555/api/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
