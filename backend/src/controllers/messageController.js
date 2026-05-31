import Message from '../models/Message.js';
import User from '../models/User.js';

export async function getMessagesByRoom(req, res) {
  try {
    const { room } = req.params;
    const { limit = 50, before } = req.query;

    const query = { room };
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .lean();

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select('username status lastSeen')
      .sort({ status: -1, username: 1 })
      .lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getOnlineUsers(req, res) {
  try {
    const users = await User.find({ status: 'online' })
      .select('username lastSeen')
      .lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch online users' });
  }
}
