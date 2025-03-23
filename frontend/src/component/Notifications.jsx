import React from 'react';
import { useNotifications } from '../context/NotificationContext';


const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li 
              key={notification._id} 
              className={`notification-item ${notification.read ? 'read' : ''}`}
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
              {!notification.read && (
                <button 
                  className="mark-read-button" 
                  onClick={() => markAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
