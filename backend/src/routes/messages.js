import express from 'express';
import { getMessagesByRoom } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:room', getMessagesByRoom);

export default router;
