import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { fetchMessages } from '../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

export default function ChatRoom({ username, room, onLeave }) {
  const {
    connected,
    messages,
    setMessages,
    onlineUsers,
    typingUsers,
    error,
    sendMessage,
    emitTyping,
    emitStopTyping,
  } = useSocket(username, room);

  useEffect(() => {
    fetchMessages(room)
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [room, setMessages]);

  const othersTyping = typingUsers.filter((u) => u !== username);

  return (
    <div className="chat-layout">
      <header className="chat-header">
        <div>
          <h2>#{room}</h2>
          <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Connected' : 'Reconnecting...'}
          </span>
        </div>
        <button className="leave-btn" onClick={onLeave}>Leave</button>
      </header>

      <div className="chat-body">
        <main className="chat-main">
          {error && <div className="error-banner">{error}</div>}
          <MessageList messages={messages} currentUser={username} />
          {othersTyping.length > 0 && (
            <p className="typing-indicator">
              {othersTyping.join(', ')} {othersTyping.length === 1 ? 'is' : 'are'} typing...
            </p>
          )}
          <MessageInput
            onSend={sendMessage}
            onTyping={emitTyping}
            onStopTyping={emitStopTyping}
            disabled={!connected}
          />
        </main>
        <UserList onlineUsers={onlineUsers} currentUser={username} />
      </div>
    </div>
  );
}
