import React from 'react';
import ChatRoom from './ChatRoom';

function PrivateRoom({ socket, room, username }) {
  // Just reuse ChatRoom for now
  return (
    <ChatRoom socket={socket} room={room} username={username} />
  );
}

export default PrivateRoom;