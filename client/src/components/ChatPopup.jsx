import React, { useState, useEffect, useRef } from 'react';

const ChatPopup = ({ messages = [], onSendMessage, chatInput = '', setChatInput, students = [], onKickStudent }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('Chat');
  const messagesEndRef = useRef(null);

  const TABS = ['Chat', 'Participants'];

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      onSendMessage(e);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 1000,
      width: 'calc(100vw - 40px)',
      maxWidth: 400
    }}>
      {open ? (
        <div style={{ 
          background: '#fff', 
          borderRadius: 16, 
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)', 
          overflow: 'hidden',
          border: '1px solid #e9ecef'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e9ecef'
          }}>
            {TABS.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: tab === tabName ? '#7765DA' : 'transparent',
                  color: tab === tabName ? '#fff' : '#6b7280',
                  border: 'none',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tabName}
              </button>
            ))}
            <button 
              onClick={() => setOpen(false)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: 'clamp(18px, 4.5vw, 22px)', 
                cursor: 'pointer', 
                color: '#bbb',
                padding: '8px 12px'
              }}
            >
              ×
            </button>
          </div>
          
          {/* Tab Content */}
          <div style={{
            maxHeight: 300,
            overflow: 'hidden'
          }}>
            {tab === "Chat" ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 300
              }}>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  background: '#fafaff'
                }}>
                  {messages.length === 0 ? (
                    <div style={{ 
                      color: '#bbb', 
                      fontWeight: 500, 
                      fontSize: 'clamp(14px, 3.5vw, 16px)', 
                      textAlign: 'center', 
                      marginTop: 40 
                    }}>
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} style={{
                        marginBottom: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.sender === 'Teacher' ? 'flex-end' : 'flex-start'
                      }}>
                        <span style={{
                          color: msg.sender === 'Teacher' ? '#7765DA' : '#22223b',
                          fontWeight: 600,
                          fontSize: 'clamp(12px, 3vw, 14px)',
                          marginBottom: 2
                        }}>
                          {msg.sender}
                        </span>
                        <span style={{
                          background: msg.sender === 'Teacher' ? '#e9e6fd' : '#22223b',
                          color: msg.sender === 'Teacher' ? '#7765DA' : '#fff',
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 'clamp(13px, 3.5vw, 15px)',
                          fontWeight: 500,
                          maxWidth: '80%',
                          wordBreak: 'break-word',
                          display: 'inline-block'
                        }}>
                          {msg.text}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} style={{
                  display: 'flex',
                  borderTop: '1px solid #e9ecef',
                  padding: '12px',
                  background: '#fff'
                }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      background: 'transparent',
                      color: '#22223b',
                      padding: '8px 12px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    style={{
                      background: '#7765DA',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 3.5vw, 15px)',
                      marginLeft: 8,
                      cursor: chatInput.trim() ? 'pointer' : 'not-allowed',
                      opacity: chatInput.trim() ? 1 : 0.6
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div style={{
                padding: '16px',
                maxHeight: 300,
                overflowY: 'auto'
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#6b7280',
                  marginBottom: 12,
                  marginLeft: 4
                }}>
                  Participants ({students.length})
                </div>
                <div>
                  {students.map((name, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: idx < students.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                        color: '#22223b'
                      }}>
                        {name}
                      </span>
                      {onKickStudent && (
                        <button
                          onClick={() => onKickStudent(name)}
                          style={{
                            background: '#ff4757',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '4px 8px',
                            fontSize: 'clamp(11px, 2.5vw, 13px)',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Kick
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)} 
          style={{ 
            background: '#7765DA', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '50%', 
            width: 'clamp(48px, 12vw, 56px)', 
            height: 'clamp(48px, 12vw, 56px)', 
            fontSize: 'clamp(20px, 5vw, 28px)', 
            fontWeight: 700, 
            boxShadow: '0 2px 16px rgba(124,93,250,0.13)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginLeft: 'auto'
          }}
        >
          <span role="img" aria-label="chat">💬</span>
        </button>
      )}
    </div>
  );
};

export default ChatPopup; 