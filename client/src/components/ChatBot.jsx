import React, { useState, useEffect, useRef } from 'react';

const ChatBot = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! I\'m your AI assistant. How can I help you with the polling session?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const botResponses = {
    'help': 'I can help you with: submitting answers, understanding poll questions, checking results, and general session information.',
    'how to submit': 'To submit your answer, simply click on one of the options and then click the "Submit" button.',
    'timer': 'The timer shows how much time you have left to answer the current poll question.',
    'results': 'Poll results will be shown automatically once the teacher ends the poll or when all students have submitted their answers.',
    'what is this': 'This is a live polling system where teachers can create questions and students can answer them in real-time.',
    'how does it work': 'Teachers create polls with questions and options. Students select their answers and submit them. Results are shown in real-time.',
    'can i change my answer': 'Once you submit your answer, you cannot change it. Make sure to review your selection before submitting.',
    'what if i get kicked': 'If you get kicked from the session, you\'ll need to rejoin. Please follow the teacher\'s instructions.',
    'hello': 'Hello! How can I assist you with the polling session?',
    'hi': 'Hi there! Need help with anything related to the poll?',
    'thanks': 'You\'re welcome! Let me know if you need anything else.',
    'thank you': 'You\'re welcome! Feel free to ask if you have more questions.'
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Default responses for common patterns
    if (lowerMessage.includes('submit') || lowerMessage.includes('answer')) {
      return 'To submit your answer, click on one of the options and then click the "Submit" button. Make sure to review your choice before submitting.';
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('timer')) {
      return 'The timer shows the remaining time to answer the current poll question. Make sure to submit your answer before time runs out!';
    }
    
    if (lowerMessage.includes('poll') || lowerMessage.includes('question')) {
      return 'Polls are questions created by your teacher. You can select from the given options and submit your answer. Results are shown after everyone answers or when time runs out.';
    }
    
    if (lowerMessage.includes('result') || lowerMessage.includes('score')) {
      return 'Poll results will be displayed automatically once the teacher ends the poll or when all students have submitted their answers. You\'ll see how many people chose each option.';
    }
    
    // Default response
    return 'I\'m here to help! You can ask me about submitting answers, understanding polls, checking results, or any other questions about this session.';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: input.trim(),
        time: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Simulate bot response delay
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: getBotResponse(input.trim()),
          time: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 2000 }}>
      {isOpen ? (
        <div style={{ 
          width: 350, 
          background: '#fff', 
          borderRadius: 16, 
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)', 
          padding: 0, 
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '16px 20px', 
            borderBottom: '1.5px solid #f0f0f0', 
            fontWeight: 700, 
            fontSize: 18,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderRadius: '16px 16px 0 0'
          }}>
            <span>🤖 AI Assistant</span>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: 22, 
                cursor: 'pointer', 
                color: '#fff' 
              }}
            >
              ×
            </button>
          </div>
          <div style={{ 
            flex: 1, 
            minHeight: 300, 
            maxHeight: 400, 
            overflowY: 'auto', 
            padding: '16px 20px', 
            background: '#fafaff' 
          }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ 
                marginBottom: 12, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <span style={{ 
                  color: msg.sender === 'user' ? '#667eea' : '#22223b', 
                  fontWeight: 600, 
                  fontSize: 14, 
                  marginBottom: 2 
                }}>
                  {msg.sender === 'user' ? userName : 'AI Assistant'}
                </span>
                <span style={{ 
                  background: msg.sender === 'user' ? '#e9e6fd' : '#22223b', 
                  color: msg.sender === 'user' ? '#667eea' : '#fff', 
                  borderRadius: 8, 
                  padding: '8px 14px', 
                  fontSize: 15, 
                  fontWeight: 500, 
                  maxWidth: 280, 
                  wordBreak: 'break-word', 
                  display: 'inline-block' 
                }}>
                  {msg.text}
                </span>
                <span style={{ 
                  fontSize: 12, 
                  color: '#999', 
                  marginTop: 2 
                }}>
                  {msg.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} style={{ 
            display: 'flex', 
            borderTop: '1.5px solid #f0f0f0', 
            padding: '10px 14px', 
            background: '#fff',
            borderRadius: '0 0 16px 16px'
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{ 
                flex: 1, 
                border: 'none', 
                outline: 'none', 
                fontSize: 16, 
                background: 'transparent', 
                color: '#22223b',
                padding: '8px 12px'
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim()} 
              style={{ 
                background: '#667eea', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 18px', 
                fontWeight: 600, 
                fontSize: 16, 
                marginLeft: 8, 
                cursor: input.trim() ? 'pointer' : 'not-allowed', 
                transition: 'all 0.2s',
                opacity: input.trim() ? 1 : 0.6
              }}
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '50%', 
            width: 60, 
            height: 60, 
            fontSize: 24, 
            fontWeight: 700, 
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
        >
          🤖
        </button>
      )}
    </div>
  );
};

export default ChatBot; 