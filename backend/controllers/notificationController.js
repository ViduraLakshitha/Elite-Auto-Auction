import Notification from '../model/Notification.js';

// Get all notifications (admin only)
export const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Filter by type if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Search by title or message
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fname lname email');

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get user-specific notifications or global notifications
    const query = {
      $or: [
        { userId },
        { isGlobal: true }
      ]
    };
    
    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unread: await Notification.countDocuments({ ...query, isRead: false })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, isGlobal, priority, actionUrl, expiresAt } = req.body;
    
    // Validate input
    if (!title || !message || !type) {
      return res.status(400).json({ message: 'Title, message, and type are required fields' });
    }
    
    // If it's a global notification, userId is not required
    if (!isGlobal && !userId) {
      return res.status(400).json({ message: 'userId is required for non-global notifications' });
    }
    
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      isGlobal: isGlobal || false,
      priority,
      actionUrl,
      expiresAt
    });
    
    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a notification
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, type, isGlobal, priority, actionUrl, expiresAt } = req.body;
    
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      {
        title,
        message,
        type,
        isGlobal,
        priority,
        actionUrl,
        expiresAt
      },
      { new: true }
    );
    
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedNotification = await Notification.findByIdAndDelete(id);
    
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { 
        $or: [
          { userId },
          { isGlobal: true }
        ],
        isRead: false
      },
      { isRead: true }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all expired notifications (can be run via cron job)
export const deleteExpiredNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    res.status(200).json({ 
      message: 'Expired notifications deleted successfully',
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 