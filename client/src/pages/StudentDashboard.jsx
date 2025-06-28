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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: 20 }}>
        <div style={{
          background: '#fff',
          padding: '40px 32px',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          minWidth: 350,
          maxWidth: 400,
          width: '100%',
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
            fontSize: '2rem',
            marginBottom: 8,
            color: '#22223b',
            lineHeight: 1.1,
          }}>
            You've been Kicked out !
          </h2>
          <div style={{
            color: '#6E6E6E',
            fontSize: 16,
            marginTop: 12,
            fontWeight: 500,
          }}>
            Looks like the teacher had removed you from the poll system. Please<br />Try again sometime.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 48 }}>
      {/* Bold, dark greeting */}
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24, color: '#22223b', letterSpacing: 0.2 }}>
        Hello, {name}!
      </h2>
      {currentPoll ? (
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          {/* Top bar: Question number and timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Question 1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>⏱️</span>
              <span style={{ fontWeight: 700, color: timer <= 10 ? '#E53935' : '#222', fontSize: 16 }}>{`00:${timer.toString().padStart(2, '0')}`}</span>
            </div>
          </div>
          {/* Question bar */}
          <div style={{ background: 'linear-gradient(90deg, #22223b 80%, #444 100%)', color: '#fff', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: 17, marginBottom: 18, boxShadow: '0 2px 8px #0001' }}>
            {currentPoll.question}
          </div>
          {/* Options as selectable buttons */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 0, marginBottom: 24 }}>
              {(currentPoll.options || []).map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => !submitted && setSelected(opt)}
                  style={{
                    display: 'flex', alignItems: 'center', marginBottom: 0, borderBottom: idx < (currentPoll.options.length - 1) ? '1px solid #eee' : 'none',
                    background: selected === opt ? '#7765DA33' : '#f8f8fa',
                    borderRadius: idx === 0 ? '12px 12px 0 0' : idx === (currentPoll.options.length - 1) ? '0 0 12px 12px' : 0,
                    padding: 0,
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    background: '#7765DA', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, margin: '0 18px'
                  }}>{idx + 1}</div>
                  <div style={{ flex: 1, fontWeight: 700, fontSize: 16, color: '#22223b' }}>{opt}</div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={!selected || submitted}
              style={{
                display: 'block',
                margin: '0 auto',
                background: 'linear-gradient(90deg, #7765DA 0%, #4F0DCE 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 32,
                padding: '14px 48px',
                fontWeight: 800,
                fontSize: 18,
                cursor: !selected || submitted ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px #7765DA22',
                opacity: !selected || submitted ? 0.6 : 1,
                marginBottom: 16,
                marginTop: 8,
                transition: 'all 0.2s',
              }}
            >
              {submitted ? 'Submitted' : 'Submit'}
            </button>
          </form>
          {/* Waiting message */}
          {submitted && (
            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 22, marginTop: 32 }}>
              Wait for the teacher to ask a new question.
            </div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 20, color: "#888", fontWeight: 500, marginTop: 80, textAlign: 'center' }}>
          Wait for the teacher to ask a new question…
        </div>
      )}
      {/* Floating chat/participants modal at bottom right */}
      <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000, width: 380, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.13)' }}>
        <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: 0 }}>
          {TABS.map((t) => (
            <div
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "12px 0 8px 0",
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#22223b" : "#888",
                borderBottom: tab === t ? "3px solid #7765DA" : "3px solid transparent",
                cursor: "pointer",
                fontSize: 17,
                letterSpacing: 0.2,
                background: "#fff",
                transition: "all 0.2s"
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {tab === "Chat" ? (
          <>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 16, padding: 16, borderRadius: 12, background: "#f9f9f9", boxShadow: "0 2px 8px #0000001a" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 14, color: "#555" }}>{msg?.time || ""}</div>
                  <div style={{ fontWeight: 500, fontSize: 16 }}>{msg?.sender || "Unknown"}:</div>
                  <div style={{ fontSize: 15, color: "#333" }}>{msg?.text || ""}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} style={{ display: "flex", gap: 8, padding: '0 16px 16px 16px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 24,
                  border: "1px solid #ddd",
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  borderRadius: 24,
                  background: "#6366f1",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 17,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #6366f122",
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ marginTop: 16, padding: '0 16px 16px 16px' }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#888', marginBottom: 12, marginLeft: 4 }}>Name</div>
            <div>
              {students.map((name, idx) => (
                <div key={idx} style={{ fontWeight: 700, fontSize: 16, color: '#22223b', marginBottom: 10 }}>{name}</div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Chatbot Component */}
      <ChatBot userName={name} />
    </div>
  );
};

export default StudentDashboard;