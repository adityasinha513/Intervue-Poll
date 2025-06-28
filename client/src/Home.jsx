import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  const handleContinue = () => {
    if (role === 'teacher') navigate('/teacher');
    else if (role === 'student') navigate('/student');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the Live Polling System</h1>
      <p>Please select the role that best describes you to begin</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setRole('student')} style={{ margin: '10px' }}>I'm a Student</button>
        <button onClick={() => setRole('teacher')} style={{ margin: '10px' }}>I'm a Teacher</button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button disabled={!role} onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
}

export default Home;