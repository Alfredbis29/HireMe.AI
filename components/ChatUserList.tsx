import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface ChatUser {
  username: string;
  room: string;
  socketId: string;
}

export default function ChatUserList() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('user_joined', (data) => {
      setUserCount(data.active_users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg mb-4">Active Users ({userCount})</h3>
      <div className="space-y-2">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.socketId} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">{user.username}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Waiting for users to join...</p>
        )}
      </div>
    </div>
  );
}
