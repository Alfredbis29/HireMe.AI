"""
Live Chat Server - Python Backend with WebSocket Support
Connects with Next.js frontend via Socket.IO
"""

from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# Enable CORS for Next.js frontend
CORS(app, resources={r"/socket.io/*": {"origins": "*"}})

# Initialize Socket.IO with CORS configuration
socketio = SocketIO(
    app,
    cors_allowed_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv('FRONTEND_URL', 'http://localhost:3000')
    ],
    async_mode='threading'
)

# In-memory storage for chat messages and users
messages = []
active_users = {}

@app.route('/')
def index():
    return {'status': 'Chat Server Running'}

@app.route('/health')
def health():
    return {'status': 'healthy', 'timestamp': datetime.now().isoformat()}

# Socket.IO Events
@socketio.on('connect')
def handle_connect():
    """Handle new client connection"""
    client_id = request.sid
    print(f'Client {client_id} connected')
    emit('connection_response', {
        'status': 'connected',
        'message': 'Welcome to live chat',
        'client_id': client_id
    })

@socketio.on('join')
def on_join(data):
    """Handle user joining a chat room"""
    username = data.get('username', 'Anonymous')
    room = data.get('room', 'general')
    
    join_room(room)
    active_users[request.sid] = {'username': username, 'room': room}
    
    message = {
        'type': 'system',
        'username': 'System',
        'message': f'{username} joined the chat',
        'timestamp': datetime.now().isoformat(),
        'room': room
    }
    messages.append(message)
    
    emit('message', message, to=room)
    emit('user_joined', {
        'username': username,
        'active_users': len([u for u in active_users.values() if u['room'] == room])
    }, to=room)

@socketio.on('message')
def handle_message(data):
    """Handle incoming chat message"""
    user = active_users.get(request.sid, {})
    username = user.get('username', 'Anonymous')
    room = user.get('room', 'general')
    
    message = {
        'type': 'user',
        'username': username,
        'message': data.get('message', ''),
        'timestamp': datetime.now().isoformat(),
        'room': room,
        'client_id': request.sid
    }
    
    messages.append(message)
    emit('message', message, to=room)

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    user = active_users.pop(request.sid, {})
    username = user.get('username', 'Anonymous')
    room = user.get('room', 'general')
    
    if username != 'Anonymous':
        message = {
            'type': 'system',
            'username': 'System',
            'message': f'{username} left the chat',
            'timestamp': datetime.now().isoformat(),
            'room': room
        }
        messages.append(message)
        emit('message', message, to=room)
    
    print(f'Client {request.sid} disconnected')

@socketio.on('typing')
def handle_typing(data):
    """Broadcast typing indicator"""
    user = active_users.get(request.sid, {})
    username = user.get('username', 'Anonymous')
    room = user.get('room', 'general')
    
    emit('user_typing', {
        'username': username,
        'is_typing': data.get('is_typing', True)
    }, to=room, skip_sid=request.sid)

@socketio.on('get_messages')
def handle_get_messages(data):
    """Send message history for a room"""
    room = data.get('room', 'general')
    room_messages = [m for m in messages if m.get('room') == room]
    emit('message_history', {
        'messages': room_messages[-50:],  # Last 50 messages
        'total': len(room_messages)
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False') == 'True'
    socketio.run(app, host='0.0.0.0', port=port, debug=debug)
