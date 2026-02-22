# Live Chat Integration Guide

This document explains the live chat feature integration between the Next.js frontend and Python Flask backend.

## Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │
│  (React Components) │
└──────────┬──────────┘
           │ Socket.IO
           │ WebSocket
           ▼
┌─────────────────────┐
│  Python Backend     │
│ (Flask + Socket.IO) │
│  :5000             │
└─────────────────────┘
```

## Components

### Frontend (Next.js/React)

1. **ChatWindow.tsx** - Main chat interface
   - User login/join functionality
   - Message display and sending
   - Typing indicators
   - Real-time updates

2. **ChatUserList.tsx** - Active users sidebar
   - Shows connected users
   - User count
   - Presence indicators

3. **chatService.ts** - Service layer
   - Handles all Socket.IO events
   - Connection management
   - Event listeners setup

### Backend (Python)

Located in `python-chat-server/`

- **app.py** - Flask server with Socket.IO
  - WebSocket event handlers
  - Room management
  - Message persistence (in-memory)
  - User tracking

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install socket.io-client
```

### 2. Start Python Backend

```bash
cd python-chat-server
source venv/bin/activate
python3 app.py
```

Server runs on `http://localhost:5000`

### 3. Configure Environment

Create `.env.local` in the Next.js root:

```env
NEXT_PUBLIC_CHAT_SERVER_URL=http://localhost:5000
```

### 4. Import Components

```tsx
import ChatWindow from '@/components/ChatWindow';
import ChatUserList from '@/components/ChatUserList';
import chatService from '@/lib/chatService';

export default function ChatPage() {
  return (
    <div className="flex gap-4">
      <ChatWindow />
      <ChatUserList />
    </div>
  );
}
```

## Socket.IO Events

### Client → Server

- **join**: Join a chat room
  ```json
  { "username": "John", "room": "general" }
  ```

- **message**: Send message
  ```json
  { "message": "Hello!" }
  ```

- **typing**: Broadcasting typing
  ```json
  { "is_typing": true }
  ```

- **get_messages**: Request history
  ```json
  { "room": "general" }
  ```

### Server → Client

- **message**: New message received
- **user_joined**: User joined room
- **user_typing**: Typing indicator
- **message_history**: Historical messages
- **connection_response**: Connection confirmation

## Features

✅ Real-time messaging
✅ Multiple chat rooms
✅ User presence tracking
✅ Typing indicators
✅ Message history
✅ System notifications
✅ CORS enabled
✅ Automatic reconnection

## Troubleshooting

**Connection refused?**
- Ensure Python server is running on port 5000
- Check CORS settings in `app.py`

**Messages not updating?**
- Verify Socket.IO client is properly connected
- Check browser console for errors

**High latency?**
- Use production WSGI server (Gunicorn + Eventlet)
- Optimize message payload size

## Production Deployment

For production, use:

```bash
pip install gunicorn eventlet
gunicorn --worker-class eventlet -w 1 app:app --bind 0.0.0.0:5000
```

Update CORS origins:
```python
cors_allowed_origins=['https://yourdomain.com']
```

## Database Integration (Future)

Currently uses in-memory storage. To persist messages:

1. Add MongoDB integration to `app.py`
2. Modify message handlers to save to database
3. Enhance `get_messages` to query stored messages

Example with MongoDB:

```python
from pymongo import MongoClient

db = MongoClient('mongodb://localhost:27017')['hireme_chat']
messages_collection = db['messages']

# In message handler:
messages_collection.insert_one({
    'username': username,
    'message': message,
    'room': room,
    'timestamp': datetime.now()
})
```
