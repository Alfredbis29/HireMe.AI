import { io, Socket } from 'socket.io-client';

class ChatService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(url: string = 'http://localhost:5000') {
    if (this.socket) return;

    this.socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Chat service connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Chat service disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  join(username: string, room: string = 'general') {
    if (this.socket) {
      this.socket.emit('join', { username, room });
    }
  }

  sendMessage(message: string) {
    if (this.socket) {
      this.socket.emit('message', { message });
    }
  }

  sendTyping(isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { is_typing: isTyping });
    }
  }

  getMessages(room: string = 'general') {
    if (this.socket) {
      this.socket.emit('get_messages', { room });
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onUserJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onMessageHistory(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('message_history', callback);
    }
  }

  isConnectedToServer(): boolean {
    return this.isConnected && this.socket !== null;
  }
}

export default new ChatService();
