import React from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

function EmojiPicker({ onSelect }) {
  return (
    <div className="emoji-picker">
      <Picker onSelect={onSelect} theme="dark" />
    </div>
  );
}

export default EmojiPicker;