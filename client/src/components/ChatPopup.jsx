import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

const ChatPopup = ({ userName }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('chat_message');
    };
  }, []);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const msg = { sender: userName, text: input.trim() };
      socket.emit('chat_message', msg);
      setInput('');
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}>
      {open ? (
        <div style={{ width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 2px 24px rgba(124,93,250,0.13)', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1.5px solid #f0f0f0', fontWeight: 700, fontSize: 18 }}>
            <span>Chat</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#bbb' }}>&times;</button>
          </div>
          <div style={{ flex: 1, minHeight: 180, maxHeight: 260, overflowY: 'auto', padding: '16px 20px', background: '#fafaff' }}>
            {messages.length === 0 ? (
              <div style={{ color: '#bbb', fontWeight: 500, fontSize: 16, textAlign: 'center', marginTop: 40 }}>No messages yet.</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: msg.sender === userName ? 'flex-end' : 'flex-start' }}>
                  <span style={{ color: msg.sender === userName ? '#7c5dfa' : '#22223b', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{msg.sender}</span>
                  <span style={{ background: msg.sender === userName ? '#e9e6fd' : '#22223b', color: msg.sender === userName ? '#7c5dfa' : '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 15, fontWeight: 500, maxWidth: 220, wordBreak: 'break-word', display: 'inline-block' }}>{msg.text}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1.5px solid #f0f0f0', padding: '10px 14px', background: '#fff' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#22223b' }}
              disabled={!userName}
            />
            <button type="submit" disabled={!input.trim()} style={{ background: '#7c5dfa', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, marginLeft: 8, cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={{ background: '#7c5dfa', color: '#fff', border: 'none', borderRadius: '50%', width: 56, height: 56, fontSize: 28, fontWeight: 700, boxShadow: '0 2px 16px rgba(124,93,250,0.13)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
    </div>
  );
};

export default ChatPopup; 