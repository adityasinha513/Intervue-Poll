import React, { useEffect, useState } from "react";
import NamePrompt from "../components/NamePrompt";
import PollQuestion from "../components/PollQuestion";
import PollOptions from "../components/PollOptions";
import PollResults from "../components/PollResults";
import Timer from "../components/Timer";
import ChatBot from "../components/ChatBot";
import ParticipantsList from "../components/ParticipantsList";
import { socket } from "../socket";

const TABS = ["Chat", "Participants"];

const StudentDashboard = () => {
  const [name, setName] = useState(sessionStorage.getItem("studentName") || "");
  const [currentPoll, setCurrentPoll] = useState(null);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [kickedOut, setKickedOut] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("Chat");
  const [students, setStudents] = useState([]);
  const [timer, setTimer] = useState(60);

  // Listen for new poll and results
  useEffect(() => {
    console.log("StudentDashboard mounted");

    // Emit student joined event when component mounts
    if (name) {
      socket.emit("student_joined", name);
    }

    socket.on("new_poll", (pollData) => {
      setCurrentPoll(pollData);
      setSelected("");
      setSubmitted(false);
      setShowResults(false);
      setResults({});
    });

    socket.on("poll_results", (data) => {
      setResults(data.results || {});
      setShowResults(true);
      setSubmitted(true);
    });

    socket.on("kicked", () => {
      setKickedOut(true);
    });

    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("student_list", (list) => setStudents(list));
    socket.emit("get_student_list");

    return () => {
      socket.off("new_poll");
      socket.off("poll_results");
      socket.off("kicked");
      socket.off("chat_message");
      socket.off("student_list");
    };
  }, [name]);

  // Timer logic
  useEffect(() => {
    if (!currentPoll || submitted) return;
    setTimer(currentPoll.duration || 60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPoll, submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    socket.emit("submit_answer", { name, answer: selected });
    setSubmitted(true);
    setShowResults(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const msg = { sender: name, text: input.trim(), time: new Date().toLocaleTimeString() };
      socket.emit("chat_message", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  // Timer expire handler
  const handleTimerExpire = () => {
    socket.emit("request_results");
    setShowResults(true);
    setSubmitted(true);
  };

  // Always show NamePrompt if name is not set
  if (!name) {
    return <NamePrompt onSetName={setName} />;
  }

  if (kickedOut) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#fff', 
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#fff',
          padding: '32px 24px',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{
              background: '#7765DA',
              color: '#fff',
              borderRadius: 16,
              padding: '7px 22px',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 0.5,
              display: 'inline-block',
            }}>✨ Intervue Poll</span>
          </div>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            marginBottom: 8,
            color: '#22223b',
            lineHeight: 1.1,
          }}>
            You've been Kicked out !
          </h2>
          <div style={{
            color: '#6E6E6E',
            fontSize: 'clamp(14px, 4vw, 16px)',
            marginTop: 12,
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            Looks like the teacher had removed you from the poll system. Please try again sometime.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#fff", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      padding: "20px",
      boxSizing: "border-box"
    }}>
      {/* Bold, dark greeting */}
      <h2 style={{ 
        fontWeight: 800, 
        fontSize: 'clamp(24px, 6vw, 28px)', 
        marginBottom: 24, 
        color: '#22223b', 
        letterSpacing: 0.2,
        textAlign: 'center'
      }}>
        Hello, {name}!
      </h2>
      
      {currentPoll ? (
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          {/* Top bar: Question number and timer */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 18, 
            marginBottom: 8,
            flexWrap: 'wrap'
          }}>
            <div style={{ fontWeight: 700, fontSize: 'clamp(16px, 4vw, 20px)' }}>Question 1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>⏱️</span>
              <span style={{ 
                fontWeight: 700, 
                color: timer <= 10 ? '#E53935' : '#222', 
                fontSize: 'clamp(14px, 4vw, 16px)' 
              }}>
                {`00:${timer.toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>
          
          {/* Question bar */}
          <div style={{ 
            background: 'linear-gradient(90deg, #22223b 80%, #444 100%)', 
            color: '#fff', 
            borderRadius: 8, 
            padding: 'clamp(12px, 3vw, 18px)', 
            fontWeight: 700, 
            fontSize: 'clamp(15px, 4vw, 17px)', 
            marginBottom: 18, 
            boxShadow: '0 2px 8px #0001',
            lineHeight: 1.3
          }}>
            {currentPoll.question}
          </div>
          
          {/* Options as selectable buttons */}
          <form onSubmit={handleSubmit}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              boxShadow: '0 2px 8px #0001', 
              padding: 0, 
              marginBottom: 24 
            }}>
              {(currentPoll.options || []).map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => !submitted && setSelected(opt)}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 0, 
                    borderBottom: idx < (currentPoll.options.length - 1) ? '1px solid #eee' : 'none',
                    background: selected === opt ? '#7765DA33' : '#f8f8fa',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === (currentPoll.options.length - 1) ? '0 0 12px 12px' : 0,
                    padding: 'clamp(16px, 4vw, 20px)',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    minHeight: '60px'
                  }}
                >
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: selected === opt ? '2px solid #7765DA' : '2px solid #ddd',
                    background: selected === opt ? '#7765DA' : 'transparent',
                    marginRight: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {selected === opt && (
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#fff'
                      }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: 'clamp(15px, 4vw, 17px)',
                    fontWeight: 600,
                    color: '#22223b',
                    flex: 1,
                    lineHeight: 1.3
                  }}>
                    {opt}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Submit button */}
            {!submitted && selected && (
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#7765DA',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '16px 24px',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: 24,
                  minHeight: '56px'
                }}
              >
                Submit Answer
              </button>
            )}
          </form>
          
          {/* Results */}
          {showResults && (
            <PollResults results={results} />
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: 'clamp(16px, 4vw, 18px)',
          marginTop: 40
        }}>
          Waiting for the teacher to start a poll...
        </div>
      )}
      
      {/* Floating Chat/Participants Modal */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
        width: 'calc(100vw - 40px)',
        maxWidth: 400
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          border: '1px solid #e9ecef'
        }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e9ecef'
          }}>
            {TABS.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: tab === tabName ? '#7765DA' : 'transparent',
                  color: tab === tabName ? '#fff' : '#6b7280',
                  border: 'none',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tabName}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div style={{
            maxHeight: 300,
            overflow: 'hidden'
          }}>
            {tab === "Chat" ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 300
              }}>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  background: '#fafaff'
                }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{
                      marginBottom: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === name ? 'flex-end' : 'flex-start'
                    }}>
                      <span style={{
                        color: msg.sender === name ? '#7765DA' : '#22223b',
                        fontWeight: 600,
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        marginBottom: 2
                      }}>
                        {msg.sender === name ? 'You' : msg.sender}
                      </span>
                      <span style={{
                        background: msg.sender === name ? '#e9e6fd' : '#22223b',
                        color: msg.sender === name ? '#7765DA' : '#fff',
                        borderRadius: 8,
                        padding: '8px 12px',
                        fontSize: 'clamp(13px, 3.5vw, 15px)',
                        fontWeight: 500,
                        maxWidth: '80%',
                        wordBreak: 'break-word',
                        display: 'inline-block'
                      }}>
                        {msg.text}
                      </span>
                      <span style={{
                        fontSize: 'clamp(10px, 2.5vw, 12px)',
                        color: '#999',
                        marginTop: 2
                      }}>
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSend} style={{
                  display: 'flex',
                  borderTop: '1px solid #e9ecef',
                  padding: '12px',
                  background: '#fff'
                }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: 'clamp(14px, 3.5vw, 16px)',
                      background: 'transparent',
                      color: '#22223b',
                      padding: '8px 12px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    style={{
                      background: '#7765DA',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 3.5vw, 15px)',
                      marginLeft: 8,
                      cursor: input.trim() ? 'pointer' : 'not-allowed',
                      opacity: input.trim() ? 1 : 0.6
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <ParticipantsList students={students} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;