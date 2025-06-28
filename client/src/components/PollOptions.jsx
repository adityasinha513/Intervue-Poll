import React from 'react';

const PollOptions = ({ options, selected, onSelect }) => (
  <div style={{ margin: '20px 0' }}>
    {options.map((option, index) => (
      <div key={index} style={{ 
        marginBottom: '12px',
        padding: '16px',
        border: selected === option ? '2px solid #7765DA' : '2px solid #e9ecef',
        borderRadius: '12px',
        background: selected === option ? '#f8f9ff' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
      onClick={() => onSelect(option)}
      >
        <input
          type="radio"
          name="pollOption"
          value={option}
          checked={selected === option}
          onChange={() => onSelect(option)}
          style={{ 
            accentColor: '#7765DA',
            width: '20px',
            height: '20px',
            cursor: 'pointer'
          }}
        />
        <label style={{ 
          fontSize: '16px',
          fontWeight: 600,
          color: selected === option ? '#7765DA' : '#495057',
          cursor: 'pointer',
          flex: 1,
          margin: 0
        }}>
          {option}
        </label>
      </div>
    ))}
  </div>
);

export default PollOptions;