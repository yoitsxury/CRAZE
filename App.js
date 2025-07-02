import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './Login';
import ChatRoom from './ChatRoom';
import PrivateRoom from './PrivateRoom';

const ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const socket = io(ENDPOINT);

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState([{ name: 'public', isPrivate: false }]);
  const [currentRoom, setCurrentRoom] = useState('public');
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    socket.on('room_list', (list) => setRoomList(list));
    return () => {
      socket.off('room_list');
    };
  }, []);

  const handleLogin = (name) => {
    socket.emit('login', name, (data) => {
      if (data.success) {
        setUsername(name);
        setIsAdmin(data.isAdmin);
        setRooms(data.rooms);
        localStorage.setItem('username', name);
      }
    });
  };

  const handleRoomChange = (room) => {
    setCurrentRoom(room);
  };

  const handleCreatePrivateRoom = (roomName) => {
    socket.emit('create_private_room', roomName, (res) => {
      if (res.success) {
        setRooms((prev) => [...prev, { name: roomName, isPrivate: true }]);
        setCurrentRoom(roomName);
      } else {
        alert(res.error);
      }
    });
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Messaging Room</h1>
        <span>{username} {isAdmin ? '(admin)' : ''}</span>
      </header>
      <nav>
        <button onClick={() => handleRoomChange('public')}>Public Room</button>
        {rooms
          .filter(r => r.isPrivate)
          .map(r => (
            <button key={r.name} onClick={() => handleRoomChange(r.name)}>
              {r.name}
            </button>
          ))}
        {isAdmin && (
          <button onClick={() => {
            const name = prompt('Private room name?');
            if (name) handleCreatePrivateRoom(name);
          }}>
            + Create Private Room
          </button>
        )}
      </nav>
      {currentRoom === 'public' ? (
        <ChatRoom socket={socket} room="public" username={username} />
      ) : (
        <PrivateRoom socket={socket} room={currentRoom} username={username} />
      )}
    </div>
  );
}

export default App;