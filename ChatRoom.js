import React, { useEffect, useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';

function ChatRoom({ socket, room, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    socket.emit('join_room', room, () => {});
    socket.on('chat_history', (history) => setMessages(history));
    socket.on('new_message', (msg) => setMessages(msgs => [...msgs, msg]));
    return () => {
      socket.off('chat_history');
      socket.off('new_message');
    };
  }, [room, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('send_message', { room, message: input, emoji: null });
      setInput('');
    }
  };

  const addEmoji = (emoji) => {
    setInput((inp) => inp + emoji.native);
    setShowEmoji(false);
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender === username ? 'me' : ''}`}>
            <strong>{msg.sender}</strong>: {msg.text} {msg.emoji}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="input-row">
        <button onClick={() => setShowEmoji(v => !v)}>😊</button>
        {showEmoji && <EmojiPicker onSelect={addEmoji} />}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message"
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;