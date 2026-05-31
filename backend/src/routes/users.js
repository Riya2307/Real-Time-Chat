import express from 'express';
import { getAllUsers, getOnlineUsers } from '../controllers/messageController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/online', getOnlineUsers);

export default router;
