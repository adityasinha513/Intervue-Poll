import React, { useEffect, useState } from "react";

const Timer = ({ duration, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '16px', 
      background: '#f8f9fa', 
      borderRadius: '8px',
      border: '2px solid #e9ecef'
    }}>
      <div style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: timeLeft <= 10 ? '#dc3545' : '#495057' 
      }}>
        {formatTime(timeLeft)}
      </div>
      <div style={{ fontSize: '14px', color: '#6c757d', marginTop: '4px' }}>
        Time Remaining
      </div>
    </div>
  );
};

export default Timer;