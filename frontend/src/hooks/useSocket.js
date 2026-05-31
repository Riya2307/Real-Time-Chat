import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '../constants/events';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useSocket(username, room) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username || !room) return;

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, { username, room });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(SOCKET_EVENTS.ONLINE_USERS, (users) => {
      setOnlineUsers(users);
    });

    socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, ({ username: name, status, lastSeen }) => {
      setOnlineUsers((prev) => {
        const exists = prev.find((u) => u.username === name);
        if (status === 'online') {
          return exists
            ? prev.map((u) => (u.username === name ? { ...u, lastSeen } : u))
            : [...prev, { username: name, lastSeen }];
        }
        return prev.filter((u) => u.username !== name);
      });
    });

    socket.on(SOCKET_EVENTS.TYPING_INDICATOR, ({ username: name, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) return prev.includes(name) ? prev : [...prev, name];
        return prev.filter((u) => u !== name);
      });
    });

    socket.on(SOCKET_EVENTS.ERROR, ({ message }) => setError(message));

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
      socket.disconnect();
    };
  }, [username, room]);

  const sendMessage = useCallback((content) => {
    socketRef.current?.emit(SOCKET_EVENTS.SEND_MESSAGE, { content });
  }, []);

  const emitTyping = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.TYPING);
  }, []);

  const emitStopTyping = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.STOP_TYPING);
  }, []);

  return {
    connected,
    messages,
    setMessages,
    onlineUsers,
    typingUsers,
    error,
    sendMessage,
    emitTyping,
    emitStopTyping,
  };
}
