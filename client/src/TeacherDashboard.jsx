import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [duration, setDuration] = useState(60);
  const [pollStarted, setPollStarted] = useState(false);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pastPolls, setPastPolls] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for poll results
    socket.on("poll_results", (data) => {
      setResults(data.results);
      setShowResults(true);
    });

    socket.on("poll_ended", () => {
      setPollStarted(false);
      setTimeLeft(0);
    });

    socket.on("past_polls", (polls) => {
      setPastPolls(polls);
    });

    socket.on("student_list", (students) => {
      setStudentList(students);
    });

    // Get initial data
    socket.emit("get_past_polls");
    socket.emit("get_student_list");

    return () => {
      socket.off("poll_results");
      socket.off("poll_ended");
      socket.off("past_polls");
      socket.off("student_list");
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleStartPoll = (e) => {
    e.preventDefault();
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    setPollStarted(true);
    setShowResults(false);
    setResults({});
    setTimeLeft(duration);

    socket.emit("create_poll", {
      question: question.trim(),
      options: options.filter((opt) => opt.trim()),
      duration,
    });

    showNotification("Poll started successfully!", "success");
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const kickStudent = (studentName) => {
    socket.emit("kick_student", studentName);
    showNotification(`${studentName} has been removed`, "info");
  };

  const resetPoll = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setDuration(60);
    setPollStarted(false);
    setShowResults(false);
    setResults({});
    setTimeLeft(0);
  };

  const goHome = () => {
    navigate("/");
  };

  const getTotalVotes = () => {
    return Object.values(results).reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (count) => {
    const total = getTotalVotes();
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Teacher Dashboard
                </h1>
                <p className="text-slate-400">
                  Create and manage interactive polls
                </p>
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
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl mb-8 backdrop-blur-sm">
          {[
            {
              id: "create",
              label: "Create Poll",
              icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
            },
            {
              id: "results",
              label: "Live Results",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
            {
              id: "students",
              label: "Students",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            },
            {
              id: "history",
              label: "History",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
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
                  d={tab.icon}
                />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Poll Status */}
        {pollStarted && (
          <div className="card-elevated mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Poll Active
                  </h3>
                  <p className="text-slate-300">{question}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{timeLeft}s</div>
                <div className="text-slate-400">remaining</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((duration - timeLeft) / duration) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "create" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Poll Creation Form */}
            <div className="card-elevated">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create New Poll
              </h2>

              <form onSubmit={handleStartPoll} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Question
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your poll question..."
                    className="h-24 resize-none"
                    disabled={pollStarted}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Options
                  </label>
                  <div className="space-y-3">
                    {options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-300 font-semibold">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          disabled={pollStarted}
                          required
                        />
                        {options.length > 2 && !pollStarted && (
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {options.length < 6 && !pollStarted && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-3 flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Option
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) =>
                      setDuration(Math.max(10, parseInt(e.target.value) || 60))
                    }
                    min="10"
                    max="300"
                    disabled={pollStarted}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={
                      pollStarted ||
                      !question.trim() ||
                      options.some((opt) => !opt.trim())
                    }
                    className="btn-primary flex-1"
                  >
                    {pollStarted ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Poll Active
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
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1M9 16v1a3 3 0 003 3m3-6V9a4 4 0 00-8 0v2.5"
                          />
                        </svg>
                        Start Poll
                      </>
                    )}
                  </button>

                  {!pollStarted && (
                    <button
                      type="button"
                      onClick={resetPoll}
                      className="btn-secondary"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">
                      {studentList.length}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Students Online
                    </div>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">
                      {pastPolls.length}
                    </div>
                    <div className="text-slate-400 text-sm">Total Polls</div>
                  </div>
                  <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                    <div className="text-2xl font-bold text-emerald-400">
                      {getTotalVotes()}
                    </div>
                    <div className="text-slate-400 text-sm">Current Votes</div>
                  </div>
                  <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-400">
                      {pollStarted ? timeLeft : "0"}
                    </div>
                    <div className="text-slate-400 text-sm">Time Left</div>
                  </div>
                </div>
              </div>

              {/* Current Poll Preview */}
              {question && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Poll Preview
                  </h3>
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="text-white font-medium mb-3">
                      {question}
                    </div>
                    <div className="space-y-2">
                      {options
                        .filter((opt) => opt.trim())
                        .map((option, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-3 text-slate-300"
                          >
                            <div className="w-4 h-4 border-2 border-slate-500 rounded-full"></div>
                            <span>{option}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="card-elevated">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-blue-400"
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
              Live Results
            </h2>

            {showResults && Object.keys(results).length > 0 ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-lg text-white font-medium">
                    {question}
                  </div>
                  <div className="text-slate-400">
                    Total responses: {getTotalVotes()}
                  </div>
                </div>

                {options
                  .filter((opt) => opt.trim())
                  .map((option, idx) => {
                    const count = results[option] || 0;
                    const percentage = getPercentage(count);
                    return (
                      <div key={idx} className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">
                            {option}
                          </span>
                          <span className="text-slate-400">
                            {count} votes ({percentage}%)
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-slate-600 mx-auto mb-4"
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
                <div className="text-slate-400">No poll results available</div>
                <div className="text-slate-500 text-sm">
                  Start a poll to see live results here
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="card-elevated">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Students ({studentList.length})
            </h2>

            {studentList.length > 0 ? (
              <div className="grid gap-3">
                {studentList.map((student, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium">{student}</div>
                        <div className="text-slate-400 text-sm">Online</div>
                      </div>
                    </div>
                    <button
                      onClick={() => kickStudent(student)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-slate-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="text-slate-400">No students online</div>
                <div className="text-slate-500 text-sm">
                  Students will appear here when they join
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="card-elevated">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3 text-orange-400"
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
              Poll History
            </h2>

            {pastPolls.length > 0 ? (
              <div className="space-y-4">
                {pastPolls.map((poll, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-xl">
                    <div className="text-white font-medium mb-3">
                      {poll.question}
                    </div>
                    <div className="grid gap-2">
                      {poll.options?.map((option, optIdx) => {
                        const count = poll.answers
                          ? Object.values(poll.answers).filter(
                              (ans) => ans === option,
                            ).length
                          : 0;
                        return (
                          <div
                            key={optIdx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-slate-300">{option}</span>
                            <span className="text-slate-400">
                              {count} votes
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-slate-600 mx-auto mb-4"
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
                <div className="text-slate-400">No poll history</div>
                <div className="text-slate-500 text-sm">
                  Completed polls will appear here
                </div>
              </div>
            )}
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

export default TeacherDashboard;
