// src/components/NamePrompt.jsx
import React, { useEffect, useState } from 'react';

const palette = {
  primary: '#7765DA',
  text: '#22223b',
  textSecondary: '#6E6E6E',
  bg: '#fff',
};

const NamePrompt = ({ onSetName }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    const existingName = sessionStorage.getItem('studentName');
    if (existingName) {
      onSetName(existingName);
    }
  }, [onSetName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem('studentName', name);
      onSetName(name);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: palette.bg,
      padding: 20,
    }}>
      <div style={{
        background: '#fff',
        padding: '40px 32px',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
        minWidth: 350,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{
            background: palette.primary,
            color: '#fff',
            borderRadius: 16,
            padding: '7px 22px',
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 0.5,
            display: 'inline-block',
          }}>✨ Intervue Poll</span>
        </div>
        <h2 style={{
          fontWeight: 400,
          fontSize: '2.2rem',
          marginBottom: 8,
          color: palette.text,
          lineHeight: 1.1,
        }}>
          Let's <span style={{ fontWeight: 800 }}>Get Started</span>
        </h2>
        <div style={{
          color: palette.textSecondary,
          fontSize: 16,
          marginBottom: 32,
          fontWeight: 500,
        }}>
          If you're a student, you'll be able to <b>submit your answers</b>, participate in live polls, and see how your responses compare with your classmates
        </div>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label htmlFor="studentName" style={{
            display: 'block',
            fontWeight: 600,
            fontSize: 15,
            color: palette.text,
            marginBottom: 8,
            marginLeft: 4,
          }}>
            Enter your Name
          </label>
          <input
            id="studentName"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your Name"
            style={{
              width: '100%',
              padding: '14px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#f4f4f4',
              fontSize: 16,
              color: palette.text,
              fontWeight: 500,
              marginBottom: 24,
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 2px #0001',
            }}
            required
          />
          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 24,
              background: palette.primary,
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              opacity: name.trim() ? 1 : 0.6,
              marginTop: 8,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px #7765DA22',
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default NamePrompt;
