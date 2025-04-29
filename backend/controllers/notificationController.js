import { createNotification, getUserNotifications } from '../services/notificationService.js';
import { io } from '../index.js'; // Socket.io instance to emit notifications
import Notification from '../model/Notification.js';


// Create a new notification (if needed manually)
export const createNewNotification = async (req, res) => {
  try {
    const { userId, message, type, socketId } = req.body; // Add socketId to the request if necessary
    
    if (!userId || !message || !type) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Create the notification in the database
    const notification = await createNotification({ userId, message, type });

    // If a socketId is provided, emit the notification in real-time
    if (socketId) {
      io.to(socketId).emit('notification', notification); // Emit to a specific socket connection
    }

    return res.status(201).json({ notification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all notifications of a user
export const fetchUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await getUserNotifications(userId);
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchAllNotifications = async (req, res) => {
  try {
    console.log('📢 Fetching notifications...');

    const notifications = await Notification.find().sort({ createdAt: -1 });

    console.log('✅ Notifications fetched successfully!');
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);  // Log full error
    return res.status(500).json({ message: error.message });
  }
};


export const markNotificationAsRead = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const notification = await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
      );
      return res.status(200).json({ notification });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read (for admins to bulk-update)
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


