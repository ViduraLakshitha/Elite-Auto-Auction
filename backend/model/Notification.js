import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['system', 'auction', 'bid', 'payment', 'user', 'admin', 'other'], 
    required: true 
  },
  isGlobal: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) }, // 30 days by default
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  actionUrl: { type: String, default: '' }
});

export default mongoose.model('Notification', notificationSchema);
