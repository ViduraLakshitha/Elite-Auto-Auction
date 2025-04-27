import express from 'express';
import { Notification } from '../models/Notification.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.userId });
  res.json(notifications);
});

router.post('/', async (req, res) => {
  const { userId, message, type } = req.body;
  const notification = new Notification({ userId, message, type });
  await notification.save();
  res.status(201).json(notification);
});

router.put('/:id', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.sendStatus(200);
});

export default router;
