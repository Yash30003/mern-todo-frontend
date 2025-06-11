import React, { useEffect, useRef, useState } from 'react';
import './App.css'; // make sure this import is present

const socket = new WebSocket(
  process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:3001'
);

export default function Notepad() {
  const [content, setContent] = useState('');
  const ignoreIncoming = useRef(false);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'init' || (data.type === 'update' && !ignoreIncoming.current)) {
        setContent(data.content);
      }
    };
  }, []);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    ignoreIncoming.current = true;
    socket.send(JSON.stringify({ type: 'update', content: newContent }));
    setTimeout(() => (ignoreIncoming.current = false), 100);
  };

  return (
    <div className="container">
      <h1 className="heading">Realtime Notepad</h1>
      <textarea
        className="notepad"
        value={content}
        onChange={handleChange}
        placeholder="Start typing your notes here..."
      />
    </div>
  );
}
