import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import PollResults from '../components/PollResults';
import ChatPopup from '../components/ChatPopup';
import ParticipantsList from '../components/ParticipantsList';

const DEFAULT_OPTIONS = [
  { text: '', correct: false },
  { text: '', correct: false },
];
const DURATIONS = [30, 45, 60, 90, 120];
const palette = {
  primary: '#7765DA',
  accent: '#4F0DCE',
  accent2: '#5767D0',
  bg: '#F2F2F2',
  text: '#373737',
  textSecondary: '#6E6E6E',
};

const TeacherDashboard = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [duration, setDuration] = useState(60);
  const [pollStarted, setPollStarted] = useState(false);
  const [results, setResults] = useState({});
  const [students, setStudents] = useState([]);
  const [pastPolls, setPastPolls] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    socket.on('poll_results', (data) => {
      setResults(data.results || {});
      setShowResults(true);
    });
    socket.on('student_list', (list) => setStudents(list));
    socket.on('past_polls', (polls) => {
      setPastPolls(polls);
      setHistory(polls);
    });
    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.emit('get_past_polls');
    socket.emit('get_student_list');
    return () => {
      socket.off('poll_results');
      socket.off('student_list');
      socket.off('past_polls');
      socket.off('chat_message');
    };
  }, []);

  const handleOptionChange = (idx, value) => {
    setOptions(opts => opts.map((opt, i) => i === idx ? { ...opt, text: value } : opt));
  };

  const handleCorrectChange = (idx, correct) => {
    setOptions(opts => opts.map((opt, i) => i === idx ? { ...opt, correct } : opt));
  };

  const addOption = () => {
    setOptions([...options, { text: '', correct: false }]);
  };

  const handleStartPoll = (e) => {
    e.preventDefault();
    socket.emit('create_poll', {
      question,
      options: options.map(opt => opt.text),
      duration,
    });
    setPollStarted(true);
  };

  const kickStudent = (studentName) => {
    socket.emit('kick_student', studentName);
  };

  const handleShowHistory = () => {
    socket.emit('get_past_polls');
    setShowHistory(true);
  };

  const handleHideHistory = () => setShowHistory(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      socket.emit('chat_message', { sender: "Teacher", text: chatInput });
      setChatInput("");
    }
  };

  const handleAskNewQuestion = () => {
    setQuestion('');
    setOptions([
      { text: '', correct: false },
      { text: '', correct: false },
    ]);
    setResults({});
    setPollStarted(false);
    setShowResults(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fff', 
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: 820, 
        margin: '0 auto', 
        padding: '20px 0 0 0' 
      }}>
        {/* Badge */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <span style={{ 
            background: palette.primary, 
            color: '#fff', 
            borderRadius: 16, 
            padding: '7px 22px', 
            fontWeight: 700, 
            fontSize: 'clamp(15px, 4vw, 17px)' 
          }}>
            ✨ Intervue Poll
          </span>
        </div>
        
        {/* Heading */}
        <h2 style={{ 
          fontWeight: 400, 
          fontSize: 'clamp(2rem, 6vw, 2.7rem)', 
          marginBottom: 8, 
          color: palette.text, 
          lineHeight: 1.1,
          textAlign: 'center'
        }}>
          Let's <span style={{ fontWeight: 800 }}>Get Started</span>
        </h2>
        
        {/* Subtitle */}
        <div style={{ 
          color: palette.textSecondary, 
          fontSize: 'clamp(16px, 4vw, 18px)', 
          marginBottom: 32, 
          fontWeight: 500, 
          maxWidth: 600,
          textAlign: 'center',
          margin: '0 auto 32px auto',
          lineHeight: 1.4
        }}>
          You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </div>
        
        {/* Form */}
        <form onSubmit={handleStartPoll} style={{ marginBottom: 0 }}>
          {/* Question input row */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px',
            marginBottom: 18 
          }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 'clamp(16px, 4vw, 18px)', 
              color: palette.text 
            }}>
              Enter your question
            </div>
            <select 
              value={duration} 
              onChange={e => setDuration(Number(e.target.value))} 
              style={{ 
                padding: '12px 16px', 
                borderRadius: 12, 
                border: 'none', 
                fontWeight: 600, 
                fontSize: 'clamp(14px, 3.5vw, 16px)', 
                color: palette.primary, 
                background: palette.bg, 
                boxShadow: '0 1px 4px #0001', 
                outline: 'none', 
                cursor: 'pointer', 
                appearance: 'none',
                width: '100%',
                maxWidth: '200px'
              }} 
              disabled={pollStarted}
            >
              {DURATIONS.map(d => <option key={d} value={d}>{d} seconds</option>)}
            </select>
          </div>
          
          {/* Textarea with char count inside */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value.slice(0, 100))}
              placeholder="Type your question here..."
              maxLength={100}
              rows={3}
              style={{ 
                width: '100%', 
                padding: '20px 16px 40px 16px', 
                borderRadius: 12, 
                border: 'none', 
                fontSize: 'clamp(16px, 4vw, 19px)', 
                background: palette.bg, 
                resize: 'none', 
                fontWeight: 600, 
                color: palette.text, 
                boxSizing: 'border-box', 
                minHeight: 90 
              }}
              disabled={pollStarted}
            />
            <div style={{ 
              position: 'absolute', 
              right: 16, 
              bottom: 12, 
              color: palette.textSecondary, 
              fontSize: 'clamp(13px, 3.5vw, 15px)' 
            }}>
              {question.length}/100
            </div>
          </div>
          
          {/* Edit Options */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '8px',
            marginBottom: 12 
          }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 'clamp(16px, 4vw, 18px)', 
              color: palette.text 
            }}>
              Edit Options
            </div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: 'clamp(14px, 3.5vw, 16px)', 
              color: palette.textSecondary,
              textAlign: 'center'
            }}>
              Mark the correct answer
            </div>
          </div>
          
          {options.map((opt, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 12, 
              marginBottom: 16,
              padding: '16px',
              background: palette.bg,
              borderRadius: 12
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12 
              }}>
                <div style={{ 
                  background: palette.primary, 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: 'clamp(28px, 7vw, 32px)', 
                  height: 'clamp(28px, 7vw, 32px)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800, 
                  fontSize: 'clamp(14px, 3.5vw, 18px)' 
                }}>
                  {idx + 1}
                </div>
                <input
                  type="text"
                  value={opt.text}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  style={{ 
                    flex: 1, 
                    padding: '12px 16px', 
                    borderRadius: 10, 
                    border: 'none', 
                    fontSize: 'clamp(14px, 3.5vw, 16px)', 
                    background: '#fff', 
                    fontWeight: 600, 
                    color: palette.text, 
                    boxSizing: 'border-box' 
                  }}
                  disabled={pollStarted}
                  required
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 24
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  fontWeight: 700, 
                  color: palette.primary, 
                  fontSize: 'clamp(14px, 3.5vw, 16px)' 
                }}>
                  <input 
                    type="radio" 
                    name={`correct${idx}`} 
                    checked={opt.correct === true} 
                    onChange={() => handleCorrectChange(idx, true)} 
                    disabled={pollStarted} 
                    style={{ 
                      accentColor: palette.primary, 
                      width: 18, 
                      height: 18, 
                      marginRight: 4 
                    }} 
                  /> 
                  Correct
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  fontWeight: 700, 
                  color: palette.textSecondary, 
                  fontSize: 'clamp(14px, 3.5vw, 16px)' 
                }}>
                  <input 
                    type="radio" 
                    name={`correct${idx}`} 
                    checked={opt.correct === false} 
                    onChange={() => handleCorrectChange(idx, false)} 
                    disabled={pollStarted} 
                    style={{ 
                      accentColor: palette.primary, 
                      width: 18, 
                      height: 18, 
                      marginRight: 4 
                    }} 
                  /> 
                  Incorrect
                </label>
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addOption} 
            disabled={pollStarted} 
            style={{ 
              background: '#fff', 
              color: palette.primary, 
              border: `1.5px solid ${palette.primary}`, 
              borderRadius: 10, 
              padding: '12px 20px', 
              fontWeight: 700, 
              fontSize: 'clamp(14px, 3.5vw, 16px)', 
              marginBottom: 24, 
              cursor: pollStarted ? 'not-allowed' : 'pointer', 
              transition: 'all 0.2s', 
              marginTop: 8,
              width: '100%',
              maxWidth: '200px'
            }}
          >
            + Add More Option
          </button>
          
          {/* Ask Question Button */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              type="submit"
              disabled={pollStarted || !question.trim() || options.some(opt => !opt.text.trim())}
              style={{
                background: 'linear-gradient(90deg, #7765DA 0%, #4F0DCE 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 24,
                padding: '16px 32px',
                fontWeight: 800,
                fontSize: 'clamp(16px, 4vw, 22px)',
                cursor: pollStarted || !question.trim() || options.some(opt => !opt.text.trim()) ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 16px #7765DA22',
                transition: 'all 0.2s',
                opacity: pollStarted || !question.trim() || options.some(opt => !opt.text.trim()) ? 0.6 : 1,
                width: '100%',
                maxWidth: '300px',
                minHeight: '56px'
              }}
            >
              {pollStarted ? 'Poll Active...' : 'Ask Question'}
            </button>
          </div>
        </form>

        {/* Results */}
        {showResults && (
          <div style={{ marginTop: 32 }}>
            <PollResults results={results} />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={handleAskNewQuestion}
                style={{
                  background: palette.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 24,
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  cursor: 'pointer',
                  minHeight: '48px'
                }}
              >
                Ask New Question
              </button>
            </div>
          </div>
        )}

        {/* History Button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={handleShowHistory}
            style={{
              background: 'transparent',
              color: palette.primary,
              border: `2px solid ${palette.primary}`,
              borderRadius: 24,
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              cursor: 'pointer',
              minHeight: '48px'
            }}
          >
            View Poll History
          </button>
        </div>

        {/* Floating Chat/Participants Modal */}
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: 'calc(100vw - 40px)',
          maxWidth: 400
        }}>
          <ChatPopup 
            messages={messages}
            onSendMessage={handleSendMessage}
            chatInput={chatInput}
            setChatInput={setChatInput}
            students={students}
            onKickStudent={kickStudent}
          />
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '24px',
            maxWidth: 600,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <h3 style={{
                fontWeight: 700,
                fontSize: 'clamp(20px, 5vw, 24px)',
                color: palette.text
              }}>
                Poll History
              </h3>
              <button
                onClick={handleHideHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: palette.textSecondary
                }}
              >
                ×
              </button>
            </div>
            
            {history.map((poll, idx) => (
              <div key={idx} style={{
                background: palette.bg,
                borderRadius: 12,
                padding: '16px',
                marginBottom: 16
              }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  color: palette.text,
                  marginBottom: 8
                }}>
                  {poll.question}
                </div>
                <div style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: palette.textSecondary
                }}>
                  Options: {poll.options.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

      {/* Chat and other sections */}
      <ChatPopup userName="Teacher" />
      {/* Results section */}
      {showResults && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontWeight: 400, fontSize: '2.7rem', color: palette.text, lineHeight: 1.1, margin: 0 }}>
              View <span style={{ fontWeight: 800 }}>Poll History</span>
            </h2>
            <button onClick={handleShowHistory} style={{ background: 'linear-gradient(90deg, #7765DA 0%, #4F0DCE 100%)', color: '#fff', border: 'none', borderRadius: 32, padding: '12px 32px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 16px #7765DA22', transition: 'all 0.2s', display: showHistory ? 'none' : 'block' }}>
              <span role="img" aria-label="history" style={{ marginRight: 8 }}>👁️</span> View Poll history
            </button>
          </div>
          <PollResults question={question} options={options.map(o => o.text)} results={results} />
          <button onClick={handleAskNewQuestion} style={{ display: 'block', margin: '32px auto 0 auto', background: 'linear-gradient(90deg, #7765DA 0%, #4F0DCE 100%)', color: '#fff', border: 'none', borderRadius: 32, padding: '20px 60px', fontWeight: 800, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 16px #7765DA22', transition: 'all 0.2s', zIndex: 100 }}>
            + Ask a new question
          </button>
          {showHistory && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 2000, overflowY: 'auto', padding: '60px 0' }}>
              <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
                <h2 style={{ fontWeight: 400, fontSize: '2.7rem', color: palette.text, lineHeight: 1.1, marginBottom: 40 }}>
                  View <span style={{ fontWeight: 800 }}>Poll History</span>
                </h2>
                {history.map((poll, i) => (
                  <div key={i} style={{ marginBottom: 48 }}>
                    <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: palette.text }}>Question {i + 1}</div>
                    <PollResults 
                      question={poll.question} 
                      options={poll.options} 
                      results={poll.results || poll.answers} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {/* Participants List */}
      <div style={{ margin: "40px 0" }}>
        <ParticipantsList
          participants={students}
          onKick={kickStudent}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;