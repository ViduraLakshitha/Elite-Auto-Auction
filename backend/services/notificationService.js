import { Notification } from '../model/Notification.js'; // Add `.js` at the end if you're using ES Modules (which you are)
import { io } from "../index.js";  // Import your Socket.io instance (make sure Socket.io is set up)

export const createNotification = async ({ userId, message, type }) => {
  try {
    // Create the notification in the database
    const notification = await Notification.create({ userId, message, type });

    // Emit the notification to the client via Socket.io in real-time
    io.emit("newNotification", notification); // This will broadcast the event to all connected clients. 
    // You can also target a specific user like io.to(userId).emit('newNotification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }};

export const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    console.error('Error fetching user notifications:', error.message);
    throw error;
  }
};
