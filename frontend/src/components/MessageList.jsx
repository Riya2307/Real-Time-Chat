function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="message-list">
      {messages.length === 0 && (
        <p className="empty-state">No messages yet. Say hello!</p>
      )}
      {messages.map((msg) => {
        const isOwn = msg.username === currentUser;
        return (
          <div key={msg._id || `${msg.timestamp}-${msg.username}`} className={`message ${isOwn ? 'own' : ''}`}>
            <div className="message-header">
              <span className="message-author">{isOwn ? 'You' : msg.username}</span>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            <p className="message-content">{msg.content}</p>
          </div>
        );
      })}
    </div>
  );
}
