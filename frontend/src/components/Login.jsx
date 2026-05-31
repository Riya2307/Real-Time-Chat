import { useState } from 'react';

export default function Login({ onJoin }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onJoin(username.trim(), room.trim() || 'general');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Real-Time Chat</h1>
        <p className="subtitle">Join a room to start messaging</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
          <label htmlFor="room">Room</label>
          <input
            id="room"
            type="text"
            placeholder="general"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    </div>
  );
}
