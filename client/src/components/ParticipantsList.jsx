import React from 'react';

const ParticipantsList = ({ students = [] }) => (
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
    {students.length === 0 ? (
      <div style={{ 
        textAlign: 'center', 
        color: '#6c757d', 
        fontStyle: 'italic',
        padding: '20px',
        fontSize: 'clamp(14px, 3.5vw, 16px)'
      }}>
        No students joined yet
      </div>
    ) : (
      <div>
        {students.map((name, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 'clamp(8px, 2vw, 12px) 0',
            borderBottom: index < students.length - 1 ? '1px solid #f0f0f0' : 'none'
          }}>
            <span style={{ 
              fontWeight: 700, 
              color: '#22223b',
              fontSize: 'clamp(14px, 3.5vw, 16px)'
            }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ParticipantsList;