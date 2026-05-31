import { Server } from 'socket.io';
import { handleConnection } from './handlers/connectionHandler.js';
import { registerRoomHandlers } from './handlers/roomHandler.js';
import { registerMessageHandlers } from './handlers/messageHandler.js';

/**
 * Initializes Socket.io with separated handler modules.
 * For horizontal scaling, attach a Redis adapter here:
 *   import { createAdapter } from '@socket.io/redis-adapter';
 *   io.adapter(createAdapter(pubClient, subClient));
 */
export function initSocket(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    handleConnection(io, socket);
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
  });

  return io;
}
