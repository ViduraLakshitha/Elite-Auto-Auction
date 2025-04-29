import express from 'express';
import { createNewNotification, fetchUserNotifications,  markNotificationAsRead, fetchAllNotifications, deleteNotification, markAllNotificationsAsRead} from '../controllers/notificationController.js';

const router = express.Router();

// POST /notifications --> create notification
// This route remains unchanged. It calls the controller to create a notification and also emits it through Socket.io
router.post('/', createNewNotification);

// GET /notifications/:userId --> fetch user's notifications
// This route remains unchanged. It fetches the notifications for a specific user from the database.
router.get('/:userId', fetchUserNotifications);

router.put("/read/:notificationId", markNotificationAsRead);

router.get('/admin/notifications', fetchAllNotifications); // Fetch all notifications
router.patch('/admin/notifications/:notificationId/read', markNotificationAsRead); // Mark notification as read
router.delete('/admin/notifications/:notificationId', deleteNotification); // Delete notification
router.patch('/admin/notifications/readAll', markAllNotificationsAsRead); // Mark all notifications as read

// Optionally, create new notification route
router.post('/admin/notifications', createNewNotification); // Create a new notification

export default router;
