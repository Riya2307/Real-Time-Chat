import User from '../../models/User.js';
import { SOCKET_EVENTS } from '../events.js';

export function handleConnection(io, socket) {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('disconnect', async () => {
    await handleDisconnect(io, socket);
  });
}

async function handleDisconnect(io, socket) {
  const { username } = socket.data;

  if (!username) return;

  try {
    await User.findOneAndUpdate(
      { username },
      { status: 'offline', lastSeen: new Date(), socketId: null }
    );

    io.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
      username,
      status: 'offline',
      lastSeen: new Date(),
    });

    console.log(`User disconnected: ${username}`);
  } catch (error) {
    console.error('Disconnect handler error:', error.message);
  }
}
