import React from 'react';

const PollQuestion = ({ question, questionNumber, timer, showTimer }) => (
  <div style={{ 
    margin: '20px 0',
    padding: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    color: '#fff',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  }}>
    {questionNumber && (
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 600,
        marginBottom: '8px',
        opacity: 0.9
      }}>
        Question {questionNumber}
      </div>
    )}
    <h2 style={{ 
      fontSize: '24px', 
      fontWeight: 700,
      margin: '0 0 16px 0',
      lineHeight: 1.3
    }}>
      {question}
    </h2>
    {showTimer && timer && (
      <div style={{ 
        fontSize: '16px',
        fontWeight: 600,
        opacity: 0.9
      }}>
        Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
      </div>
    )}
  </div>
);

export default PollQuestion;