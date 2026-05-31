const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchMessages(room, limit = 50) {
  const res = await fetch(`${API_URL}/api/messages/${encodeURIComponent(room)}?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  return res.ok ? res.json() : [];
}

export async function fetchOnlineUsers() {
  const res = await fetch(`${API_URL}/api/users/online`);
  return res.ok ? res.json() : [];
}
