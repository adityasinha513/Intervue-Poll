import React from 'react';

const ParticipantsList = ({ participants, onKick }) => (
  <div style={{ 
    maxWidth: 400, 
    margin: '0 auto', 
    padding: '24px', 
    background: '#f8f9fa', 
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  }}>
    <h3 style={{ 
      fontWeight: 700, 
      fontSize: 20, 
      marginBottom: 16, 
      color: '#333',
      textAlign: 'center'
    }}>
      Participants ({participants.length})
    </h3>
    {participants.length === 0 ? (
      <div style={{ 
        textAlign: 'center', 
        color: '#6c757d', 
        fontStyle: 'italic',
        padding: '20px'
      }}>
        No students joined yet
      </div>
    ) : (
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {participants.map((name, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 16px',
            marginBottom: '8px',
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ 
              fontWeight: 600, 
              color: '#495057',
              fontSize: '16px'
            }}>
              {name}
            </span>
            <button 
              onClick={() => onKick(name)}
              style={{
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#c82333'}
              onMouseOut={(e) => e.target.style.background = '#dc3545'}
            >
              Kick
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ParticipantsList;