import { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <Login onJoin={(username, room) => setSession({ username, room })} />;
  }

  return (
    <ChatRoom
      username={session.username}
      room={session.room}
      onLeave={() => setSession(null)}
    />
  );
}
