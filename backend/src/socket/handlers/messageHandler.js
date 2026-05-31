import Message from '../../models/Message.js';
import { SOCKET_EVENTS } from '../events.js';

export function registerMessageHandlers(io, socket) {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ content }) => {
    const { username, room } = socket.data;

    if (!username || !room) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Join a room before sending messages' });
      return;
    }

    if (!content?.trim()) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Message cannot be empty' });
      return;
    }

    try {
      const message = await Message.create({
        room,
        username,
        content: content.trim(),
        timestamp: new Date(),
      });

      const payload = {
        _id: message._id,
        room: message.room,
        username: message.username,
        content: message.content,
        timestamp: message.timestamp,
      };

      io.to(room).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, payload);
    } catch (error) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to send message' });
    }
  });

  socket.on(SOCKET_EVENTS.TYPING, () => {
    const { username, room } = socket.data;
    if (!username || !room) return;

    socket.to(room).emit(SOCKET_EVENTS.TYPING_INDICATOR, { username, isTyping: true });
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, () => {
    const { username, room } = socket.data;
    if (!username || !room) return;

    socket.to(room).emit(SOCKET_EVENTS.TYPING_INDICATOR, { username, isTyping: false });
  });
}
