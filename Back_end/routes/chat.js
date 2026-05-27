import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get conversation history between two users
router.get('/history/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 }); // Oldest first
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get unread counts for a user
router.get('/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Count how many unread messages where receiver is userId, grouped by senderId
    const unreadCounts = await Message.aggregate([
      { $match: { receiverId: userId, isRead: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } }
    ]);
    
    // Format to a more usable object { "senderId": count }
    const formattedCounts = {};
    unreadCounts.forEach(item => {
      formattedCounts[item._id] = item.count;
    });
    
    res.json(formattedCounts);
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ error: 'Failed to fetch unread counts' });
  }
});

// Mark messages from a specific sender as read
router.put('/read/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    await Message.updateMany(
      { senderId: senderId, receiverId: receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
