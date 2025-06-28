import React from 'react';

const PollResults = ({ question, options, results }) => {
  const totalVotes = Object.values(results || {}).reduce((sum, count) => sum + (count || 0), 0);
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 12, 
      boxShadow: '0 2px 8px #0001', 
      padding: 0, 
      marginBottom: 32, 
      border: '1.5px solid #7765DA22' 
    }}>
      {/* Question bar */}
      {question && (
        <div style={{ 
          background: 'linear-gradient(90deg, #22223b 80%, #444 100%)', 
          color: '#fff', 
          borderRadius: '12px 12px 0 0', 
          padding: 'clamp(12px, 3vw, 18px)', 
          fontWeight: 700, 
          fontSize: 'clamp(15px, 4vw, 17px)', 
          marginBottom: 0,
          lineHeight: 1.3
        }}>
          {question}
        </div>
      )}
      {/* Options */}
      {(options || Object.keys(results || {})).map((opt, idx) => {
        const count = results?.[opt] || 0;
        const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        return (
          <div key={idx} style={{
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'stretch', 
            marginBottom: 0, 
            borderBottom: idx < (options?.length || Object.keys(results || {}).length) - 1 ? '1px solid #eee' : 'none',
            background: percent > 0 ? '#7765DA33' : '#f8f8fa',
            borderRadius: idx === 0 ? '0' : idx === (options?.length || Object.keys(results || {}).length) - 1 ? '0 0 12px 12px' : 0,
            padding: 'clamp(12px, 3vw, 16px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <div style={{
                background: '#7765DA', 
                color: '#fff', 
                borderRadius: '50%', 
                width: 'clamp(28px, 7vw, 32px)', 
                height: 'clamp(28px, 7vw, 32px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: 'clamp(14px, 3.5vw, 18px)', 
                marginRight: '12px',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div style={{ 
                flex: 1, 
                fontWeight: 700, 
                fontSize: 'clamp(14px, 3.5vw, 16px)', 
                color: '#22223b',
                lineHeight: 1.3
              }}>
                {opt}
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: 'clamp(8px, 2vw, 12px)', 
              background: '#e0e0e0', 
              borderRadius: 6, 
              overflow: 'hidden', 
              position: 'relative',
              marginLeft: 'clamp(40px, 10vw, 44px)'
            }}>
              <div style={{ 
                width: `${percent}%`, 
                height: '100%', 
                background: '#7765DA', 
                borderRadius: 6, 
                transition: 'width 0.3s' 
              }} />
              <span style={{ 
                position: 'absolute', 
                right: '8px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                fontWeight: 700, 
                color: '#22223b', 
                fontSize: 'clamp(12px, 3vw, 15px)' 
              }}>
                {percent}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;