export default function UserList({ onlineUsers, currentUser }) {
  return (
    <aside className="user-list">
      <h3>Online ({onlineUsers.length})</h3>
      <ul>
        {onlineUsers.map((user) => (
          <li key={user.username} className={user.username === currentUser ? 'current' : ''}>
            <span className="status-dot online" />
            {user.username}
            {user.username === currentUser && <span className="you-badge">you</span>}
          </li>
        ))}
        {onlineUsers.length === 0 && (
          <li className="empty">No users online</li>
        )}
      </ul>
    </aside>
  );
}
