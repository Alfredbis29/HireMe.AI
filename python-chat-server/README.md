# Python Live Chat Server

A WebSocket-based live chat server built with Flask and Socket.IO that integrates with the Next.js frontend.

## Setup

### 1. Install Dependencies
```bash
cd python-chat-server
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run the Server
```bash
python app.py
```

The server will start on `http://localhost:5000` and accept WebSocket connections from `http://localhost:3000`.

## API Events

### Client → Server

- **connect**: Automatic connection event
- **join**: Join a chat room
  ```json
  { "username": "John", "room": "general" }
  ```
- **message**: Send a chat message
  ```json
  { "message": "Hello everyone!" }
  ```
- **typing**: Broadcast typing indicator
  ```json
  { "is_typing": true }
  ```
- **get_messages**: Request message history
  ```json
  { "room": "general" }
  ```

### Server → Client

- **connection_response**: Connection confirmation
- **message**: New chat message
- **user_joined**: User joined the room
- **user_typing**: User typing indicator
- **message_history**: Historical messages for a room

## Frontend Integration

Install Socket.IO client in your Next.js app:
```bash
npm install socket.io-client
```

Example usage:
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  socket.emit('join', { username: 'User', room: 'general' });
});

socket.on('message', (data) => {
  console.log('New message:', data);
});

socket.emit('message', { message: 'Hello!' });
```

## Features

- Real-time messaging with WebSocket
- Multiple chat rooms
- User presence tracking
- Typing indicators
- Message history (last 50 messages)
- System messages for joins/leaves
- CORS enabled for Next.js frontend

## Production Deployment

1. Change `SECRET_KEY` in `.env`
2. Set `DEBUG=False`
3. Update `FRONTEND_URL` to your production domain
4. Use a production ASGI server like Gunicorn with Eventlet:
   ```bash
   pip install gunicorn eventlet
   gunicorn --worker-class eventlet -w 1 app:app
   ```
