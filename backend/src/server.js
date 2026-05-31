import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { connectDatabase } from './config/database.js';
import { initSocket } from './socket/index.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// REST API — separated from socket logic
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

async function start() {
  await connectDatabase(MONGODB_URI);

  initSocket(httpServer, CLIENT_URL);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
