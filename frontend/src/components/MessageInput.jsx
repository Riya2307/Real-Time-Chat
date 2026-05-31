import { useState, useRef, useEffect } from 'react';

export default function MessageInput({ onSend, onTyping, onStopTyping, disabled }) {
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);

  useEffect(() => {
    return () => clearTimeout(typingTimeout.current);
  }, []);

  function handleChange(e) {
    setText(e.target.value);
    onTyping();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(onStopTyping, 1500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
    onStopTyping();
    clearTimeout(typingTimeout.current);
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleChange}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
}
