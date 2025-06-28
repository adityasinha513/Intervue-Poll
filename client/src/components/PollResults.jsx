import React from 'react';

const PollResults = ({ question, options, results }) => {
  const totalVotes = Object.values(results || {}).reduce((sum, count) => sum + (count || 0), 0);
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 0, marginBottom: 32, border: '1.5px solid #7765DA22' }}>
      {/* Question bar */}
      {question && (
        <div style={{ background: 'linear-gradient(90deg, #22223b 80%, #444 100%)', color: '#fff', borderRadius: '12px 12px 0 0', padding: '12px 18px', fontWeight: 700, fontSize: 17, marginBottom: 0 }}>
          {question}
        </div>
      )}
      {/* Options */}
      {(options || Object.keys(results || {})).map((opt, idx) => {
        const count = results?.[opt] || 0;
        const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
        return (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', marginBottom: 0, borderBottom: idx < (options?.length || Object.keys(results || {}).length) - 1 ? '1px solid #eee' : 'none',
            background: percent > 0 ? '#7765DA33' : '#f8f8fa',
            borderRadius: idx === 0 ? '0' : idx === (options?.length || Object.keys(results || {}).length) - 1 ? '0 0 12px 12px' : 0,
            padding: 0
          }}>
            <div style={{
              background: '#7765DA', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, margin: '0 18px'
            }}>{idx + 1}</div>
            <div style={{ flex: 1, fontWeight: 700, fontSize: 16, color: '#22223b' }}>{opt}</div>
            <div style={{ width: '60%', margin: '0 18px', height: 8, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${percent}%`, height: 8, background: '#7765DA', borderRadius: 6, transition: 'width 0.3s' }} />
              <span style={{ position: 'absolute', right: 8, top: -2, fontWeight: 700, color: '#22223b', fontSize: 15 }}>{percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;