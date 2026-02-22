import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  type: 'user' | 'system';
  username: string;
  message: string;
  timestamp: string;
  room: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to chat server
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketRef.current.on('connection_response', (data) => {
      console.log('Connection response:', data);
    });

    socketRef.current.on('message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    socketRef.current.on('user_typing', (data) => {
      if (data.is_typing) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChat = () => {
    if (username.trim() && socketRef.current) {
      socketRef.current.emit('join', {
        username: username,
        room: 'general',
      });
      setUsername(username);
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() && socketRef.current && username) {
      socketRef.current.emit('message', {
        message: inputValue,
      });
      setInputValue('');
    }
  };

  const handleTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { is_typing: true });
      setTimeout(() => {
        socketRef.current?.emit('typing', { is_typing: false });
      }, 1000);
    }
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Join Live Chat</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
            onKeyPress={(e) => e.key === 'Enter' && joinChat()}
          />
          <button
            onClick={joinChat}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Join Chat
          </button>
          <p className={`mt-4 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? '✓ Connected to server' : '⊗ Disconnected from server'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <h2 className="text-xl font-bold">{username} - Live Chat</h2>
        <p className="text-sm">{isConnected ? '● Online' : '● Offline'}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.type === 'system'
                  ? 'bg-gray-300 text-gray-700 text-center'
                  : msg.username === username
                  ? 'bg-blue-500 text-white ml-auto max-w-xs'
                  : 'bg-white text-gray-800 max-w-xs'
              }`}
            >
              {msg.type !== 'system' && <p className="font-bold text-sm mb-1">{msg.username}</p>}
              <p>{msg.message}</p>
              <p className="text-xs mt-1 opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))
        )}
        {isTyping && <p className="text-gray-500 italic text-sm">Someone is typing...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-300 p-4 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
