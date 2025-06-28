const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST"],
  },
});

let currentPoll = null;
let answers = {};
let totalStudents = 0;
let pollActive = false;
let pollTimeout = null;
let pastPolls = [];
let students = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Student joins
  socket.on("student_joined", (name) => {
    totalStudents++;
    students[socket.id] = name;
  });

  // Teacher creates a poll
  socket.on("create_poll", (data) => {
    if (pollActive) {
      socket.emit("error", "A poll is already active. Wait for it to finish.");
      return;
    }
    currentPoll = data;
    answers = {};
    pollActive = true;
    io.emit("new_poll", currentPoll);
    // Set poll timeout
    if (pollTimeout) clearTimeout(pollTimeout);
    pollTimeout = setTimeout(
      () => {
        pollActive = false;
        const pollResults = tallyResults(currentPoll.options, answers);
        pastPolls.push({ ...currentPoll, answers, results: pollResults });
        io.emit("poll_results", {
          results: pollResults,
        });
        io.emit("poll_ended");
      },
      (data.duration || 60) * 1000,
    );
  });

  // Student submits answer
  socket.on("submit_answer", ({ name, answer }) => {
    answers[name] = answer;
    if (Object.keys(answers).length === totalStudents) {
      pollActive = false;
      if (pollTimeout) clearTimeout(pollTimeout);
      const pollResults = tallyResults(currentPoll.options, answers);
      pastPolls.push({ ...currentPoll, answers, results: pollResults });
      io.emit("poll_results", {
        results: pollResults,
      });
      io.emit("poll_ended");
    }
  });

  socket.on("request_results", () => {
    io.emit("poll_results", {
      results: tallyResults(currentPoll.options, answers),
    });
  });

  // Teacher requests past polls
  socket.on("get_past_polls", () => {
    socket.emit("past_polls", pastPolls);
  });

  // Teacher kicks a student
  socket.on("kick_student", (studentName) => {
    const sid = Object.keys(students).find(
      (id) => students[id] === studentName,
    );
    if (sid) {
      io.to(sid).emit("kicked");
      delete students[sid];
      totalStudents = Math.max(0, totalStudents - 1);
    }
  });

  // Teacher requests student list
  socket.on("get_student_list", () => {
    io.emit("student_list", Object.values(students));
  });

  // Chat message event
  socket.on("chat_message", (msg) => {
    io.emit("chat_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (students[socket.id]) {
      delete students[socket.id];
      totalStudents = Math.max(0, totalStudents - 1);
    }
  });
});

function tallyResults(options, answers) {
  const tally = {};
  (options || []).forEach((opt) => {
    tally[opt] = 0;
  });
  Object.values(answers).forEach((ans) => {
    if (tally[ans] !== undefined) tally[ans]++;
  });
  return tally;
}

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
