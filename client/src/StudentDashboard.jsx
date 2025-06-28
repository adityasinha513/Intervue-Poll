import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

const StudentDashboard = () => {
  const [name, setName] = useState(sessionStorage.getItem("studentName") || "");
  const [inputName, setInputName] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({});
  const [isKicked, setIsKicked] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Connection status
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Listen for new poll
    socket.on("new_poll", (pollData) => {
      setQuestion(pollData.question);
      setOptions(pollData.options || []);
      setSubmitted(false);
      setSelected("");
      setShowResults(false);
      setTimer(pollData.duration || 60);
      setResults({});
      showNotification("New poll started!", "info");
    });

    // Listen for poll results
    socket.on("poll_results", (data) => {
      setResults(data.results);
      setShowResults(true);
    });

    socket.on("poll_ended", () => {
      setTimer(0);
      setShowResults(true);
      if (!submitted) {
        showNotification("Poll ended - time's up!", "info");
      }
    });

    // Listen for being kicked
    socket.on("kicked", () => {
      setIsKicked(true);
      sessionStorage.removeItem("studentName");
      showNotification("You have been removed from the session", "error");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_poll");
      socket.off("poll_results");
      socket.off("poll_ended");
      socket.off("kicked");
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !submitted) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && question && !showResults && !submitted) {
      socket.emit("request_results");
      setShowResults(true);
      setSubmitted(true);
    }
  }, [timer, question, showResults, submitted]);

  // Join as student when name is set
  useEffect(() => {
    if (name && isConnected) {
      socket.emit("student_joined", name);
    }
  }, [name, isConnected]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      const studentName = inputName.trim();
      setName(studentName);
      sessionStorage.setItem("studentName", studentName);
      socket.emit("student_joined", studentName);
      showNotification(`Welcome, ${studentName}!`, "success");
    }
  };

  const submitAnswer = (e) => {
    e.preventDefault();
    if (!selected) return;

    setSubmitted(true);
    socket.emit("submit_answer", { name, answer: selected });
    showNotification("Answer submitted successfully!", "success");
  };

  const handleOptionSelect = (option) => {
    if (!submitted && timer > 0) {
      setSelected(option);
    }
  };

  const goHome = () => {
    sessionStorage.removeItem("studentName");
    navigate("/");
  };

  const getTotalVotes = () => {
    return Object.values(results).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (count) => {
    const total = getTotalVotes();
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Kicked state
  if (isKicked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Session Ended</h1>
          <p className="text-slate-400 mb-8">
            You have been removed from the polling session
          </p>
          <button onClick={goHome} className="btn-primary">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Name input screen
  if (!name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="card-elevated text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Join Polling Session
            </h1>
            <p className="text-slate-400 mb-8">
              Enter your name to participate in interactive polls
            </p>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Enter your full name"
                  className="text-center"
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Join Session
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
              ></div>
              <span className="text-slate-400 text-sm">
                {isConnected ? "Connected to server" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Welcome, {name}!
                </h1>
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
                  ></div>
                  <span>{isConnected ? "Connected" : "Disconnected"}</span>
                </div>
              </div>
            </div>
            <button onClick={goHome} className="btn-secondary">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Exit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {question && !showResults ? (
          /* Active Poll */
          <div className="card-elevated">
            {/* Timer */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 mb-4 ${
                  timer <= 10
                    ? "border-red-500 text-red-400 animate-pulse"
                    : timer <= 30
                      ? "border-orange-500 text-orange-400"
                      : "border-blue-500 text-blue-400"
                }`}
              >
                <span className="text-2xl font-bold">{timer}</span>
              </div>
              <div className="text-slate-400">
                {timer <= 10
                  ? "Hurry up!"
                  : timer <= 30
                    ? "Time running out"
                    : "Time remaining"}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 max-w-xs mx-auto">
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      timer <= 10
                        ? "bg-gradient-to-r from-red-500 to-pink-600"
                        : timer <= 30
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                    style={{ width: `${Math.max(0, (timer / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{question}</h2>
              <p className="text-slate-400">
                {submitted
                  ? "Answer submitted! Waiting for results..."
                  : "Select your answer below"}
              </p>
            </div>

            {/* Options */}
            <form onSubmit={submitAnswer} className="space-y-4">
              <div className="grid gap-4">
                {options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`relative flex items-center p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selected === option
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500 shadow-lg"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                    } ${submitted || timer === 0 ? "opacity-75 cursor-not-allowed" : ""}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selected === option}
                      onChange={() => {}}
                      disabled={submitted || timer === 0}
                      className="sr-only"
                    />

                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300 ${
                        selected === option
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-500"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 bg-blue-500 rounded-full font-bold text-white text-xs flex items-center justify-center ${
                          selected === option ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-white font-medium">{option}</div>
                    </div>

                    {selected === option && (
                      <div className="absolute top-3 right-3">
                        <svg
                          className="w-6 h-6 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={!selected || submitted || timer === 0}
                  className="btn-primary text-lg px-12 py-4"
                >
                  {submitted ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Submitted
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : showResults && Object.keys(results).length > 0 ? (
          /* Results */
          <div className="card-elevated">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Poll Results
              </h2>
              <p className="text-lg text-white font-medium mb-2">{question}</p>
              <p className="text-slate-400">
                Total responses: {getTotalVotes()}
              </p>
              {selected && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <svg
                    className="w-4 h-4 text-blue-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-blue-300 text-sm">
                    Your answer: {selected}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {options.map((option, idx) => {
                const count = results[option] || 0;
                const percentage = getPercentage(count);
                const isMyAnswer = selected === option;
                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-xl ${
                      isMyAnswer
                        ? "bg-blue-500/10 border border-blue-500/30"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-white font-medium">{option}</span>
                        {isMyAnswer && (
                          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            Your choice
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">
                        {count} votes ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isMyAnswer
                            ? "bg-gradient-to-r from-blue-500 to-purple-600"
                            : "bg-gradient-to-r from-slate-600 to-slate-700"
                        }`}
                        style={{
                          width: `${percentage}%`,
                          minWidth: percentage > 0 ? "20px" : "0",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Waiting State */
          <div className="card-elevated text-center">
            <div className="animate-float">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <svg
                  className="w-10 h-10 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Waiting for Poll
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Your teacher will start a poll shortly. When they do, you'll be
              able to participate and submit your answers.
            </p>

            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              <span className="ml-2">Waiting...</span>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type} show`}>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {notification.type === "success" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              )}
              {notification.type === "error" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              )}
              {notification.type === "info" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
