import User from '../../models/User.js';
import { SOCKET_EVENTS } from '../events.js';

export function registerRoomHandlers(io, socket) {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ username, room }) => {
    if (!username?.trim() || !room?.trim()) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Username and room are required' });
      return;
    }

    try {
      const trimmedUsername = username.trim();
      const trimmedRoom = room.trim();

      socket.data.username = trimmedUsername;
      socket.data.room = trimmedRoom;

      await User.findOneAndUpdate(
        { username: trimmedUsername },
        {
          username: trimmedUsername,
          status: 'online',
          socketId: socket.id,
          lastSeen: new Date(),
        },
        { upsert: true, new: true }
      );

      socket.join(trimmedRoom);

      const onlineUsers = await User.find({ status: 'online' })
        .select('username lastSeen')
        .lean();

      socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
        room: trimmedRoom,
        username: trimmedUsername,
      });

      socket.to(trimmedRoom).emit(SOCKET_EVENTS.USER_JOINED, {
        username: trimmedUsername,
        room: trimmedRoom,
        timestamp: new Date(),
      });

      io.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
        username: trimmedUsername,
        status: 'online',
        lastSeen: new Date(),
      });

      io.emit(SOCKET_EVENTS.ONLINE_USERS, onlineUsers);

      console.log(`${trimmedUsername} joined room: ${trimmedRoom}`);
    } catch (error) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' });
    }
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, async () => {
    const { username, room } = socket.data;
    if (!username || !room) return;

    socket.leave(room);

    socket.to(room).emit(SOCKET_EVENTS.USER_LEFT, {
      username,
      room,
      timestamp: new Date(),
    });

    console.log(`${username} left room: ${room}`);
  });
}
