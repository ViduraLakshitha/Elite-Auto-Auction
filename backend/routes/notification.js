import express from 'express';
import Notification from '../model/Notification.js';
import {
  getAllNotifications,
  getUserNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  deleteExpiredNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

// Admin routes
router.get('/admin', getAllNotifications);
router.delete('/expired', deleteExpiredNotifications);

// User routes
router.get('/user/:userId', getUserNotifications);
router.put('/user/:userId/mark-all-read', markAllAsRead);

// CRUD operations
router.post('/', createNotification);
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/:id', updateNotification);
router.delete('/:id', deleteNotification);
router.put('/:id/mark-read', markAsRead);

export default router;
