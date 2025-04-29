// model/notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['new_auction', 'scheduled', 'live', 'ending_soon'],
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    socketId: { 
        type: String, 
        default: null 
    }  // Optional: to store the socket ID of the user to send real-time notifications

    
});

export const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
