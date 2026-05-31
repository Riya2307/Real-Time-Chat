# Real-Time Chat Application

A full-stack real-time chat app built with **React**, **Node.js + Socket.io**, and **MongoDB**.

## Features

- **Real-time bi-directional messaging** via WebSockets (Socket.io)
- **Socket rooms** with join/leave lifecycle handling
- **Persistent message storage** in MongoDB with timestamps
- **User presence tracking** (online/offline status)
- **Separated concerns** — REST API and Socket.io handlers live in distinct modules
- **Scalable architecture** — room-based broadcasting, indexed queries, Redis adapter hook point

## Project Structure

```
codec/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # REST API business logic
│   │   ├── models/          # Mongoose schemas (Message, User)
│   │   ├── routes/          # Express REST routes
│   │   ├── socket/
│   │   │   ├── handlers/    # Socket event handlers (connection, room, message)
│   │   │   ├── events.js    # Shared event name constants
│   │   │   └── index.js     # Socket.io initialization
│   │   └── server.js        # Entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/      # Login, ChatRoom, MessageList, etc.
    │   ├── hooks/           # useSocket — client-side socket lifecycle
    │   ├── services/        # REST API client
    │   └── constants/       # Socket event constants
    └── .env.example
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API and Socket.io server start on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The React app starts on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/messages/:room` | Fetch message history for a room |
| GET | `/api/users` | List all users with presence status |
| GET | `/api/users/online` | List online users only |

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a chat room |
| `leave_room` | Client → Server | Leave current room |
| `send_message` | Client → Server | Send a message to the room |
| `message_received` | Server → Client | Broadcast new message |
| `presence_update` | Server → Client | User online/offline change |
| `online_users` | Server → Client | Full online user list |
| `typing` / `stop_typing` | Client → Server | Typing indicators |

## Scalability Notes

- **Room-based broadcasting** — messages only reach clients in the same room (`io.to(room)`)
- **Indexed MongoDB queries** — `room` and `timestamp` fields are indexed for fast history retrieval
- **Horizontal scaling** — add `@socket.io/redis-adapter` in `backend/src/socket/index.js` to sync events across multiple server instances
- **API/Socket separation** — REST handles reads/history; sockets handle real-time writes and presence

## Usage

1. Open `http://localhost:5173` in two browser tabs
2. Enter different usernames and join the same room (e.g. `general`)
3. Send messages — they appear instantly in both tabs and persist in MongoDB
