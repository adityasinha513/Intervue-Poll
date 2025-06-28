# 🎯 Intervue Poll - Live Polling System

A modern, full-stack real-time polling system for classrooms, interviews, and live events. Teachers can create engaging polls, students can participate live, and results are updated in real-time — all powered by React, Node.js, and Socket.IO.

![Intervue Poll](https://img.shields.io/badge/Intervue-Poll-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io)

---
![image](https://github.com/user-attachments/assets/03fb097e-62e7-4637-8be0-6acd7e8932f0)

---
![image](https://github.com/user-attachments/assets/4767ac65-6783-4c49-b889-b1b276ad8df6)

---
![image](https://github.com/user-attachments/assets/0a93cf17-92f3-48d6-8f7e-280c1d16c32a)

## ✨ Features

### 👩‍🏫 Teacher Dashboard
- Create multiple-choice polls
- Launch polls with timers
- Monitor real-time results
- Mark correct answers
- Chat with students
- Manage participants (kick/remove)
- Access past poll history

### 👨‍🎓 Student Dashboard
- Enter via name-based login
- Participate in live polls
- Countdown timers with feedback
- View results after submission
- Chat with teacher & students
- Mobile-friendly design

### 🔄 Real-Time Capabilities
- Instant poll delivery
- Real-time answer updates
- Live student list updates
- WebSocket-powered chat (Socket.IO)

---

## 🚀 Live Deployment

- **Frontend**: [Live Site](https://your-frontend-url.onrender.com) *(Replace with actual URL)*
- **Backend**: [Render API](https://your-backend-url.onrender.com)

---

## 🛠️ Tech Stack

### Frontend
- React 19.1.0
- Vite for ultra-fast builds
- Socket.IO Client
- React Router DOM
- Responsive CSS

### Backend
- Node.js + Express
- Socket.IO for real-time events
- CORS + Environment configuration

---

## 📁 Project Structure

```
live-polling-system/
├── client/             # React frontend
│   ├── src/
│   │   ├── pages/      # Home, Teacher, Student
│   │   ├── components/ # Poll UI, Timer, Chat
│   │   └── socket.js   # Socket.IO client config
├── server/             # Express backend
│   └── index.js        # WebSocket + REST server
└── README.md
```

---

## ⚙️ Quick Setup

### Prerequisites
- Node.js >= 16
- npm or yarn

### Clone & Install
```bash
git clone https://github.com/adityasinha513/Intervue-Poll.git
cd Intervue-Poll
```

### Install Frontend
```bash
cd client
npm install
```

### Install Backend
```bash
cd ../server
npm install
```

### Run Locally
Start backend:
```bash
npm start
```
Start frontend:
```bash
cd ../client
npm run dev
```

> Open http://localhost:5173 in your browser.

---

## 🌐 Deployment Guide

### 🔵 Backend (Render)
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Set environment variable: `PORT=10000`
7. Deploy & copy your backend URL

### 🟢 Frontend (Render or Vercel)
1. Create new **Static Site**
2. Root directory: `client`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Set env var: `VITE_BACKEND_URL=https://<your-backend>.onrender.com`
6. Deploy & open the live site

---

## 🔌 Environment Variables

### Server `.env`
```env
PORT=5000
```

### Client `.env`
```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## 🧠 Socket.IO Events

### Server Emits:
- `new_poll` — Broadcast poll to students
- `poll_results` — Send results to everyone
- `student_list` — Update participant list
- `kicked_out` — Notify student of removal

### Client Emits:
- `student_joined`
- `create_poll`
- `submit_answer`
- `send_message`
- `kick_student`

---

## 📱 Mobile Optimization

- Fully responsive layout
- Tap-friendly components
- Scales from phones to tablets

---

## 🧪 Troubleshooting

| Issue | Fix |
|-------|-----|
| Socket not connecting | Check backend URL & CORS |
| Build errors | Delete node_modules & reinstall |
| Live site crashes | Use correct start/build command |

---

## 🤝 Contribution

1. Fork this repo
2. Create a new branch `feature/...`
3. Commit changes with clear messages
4. Push and create a PR

---

## 👨‍💻 Author

**Aditya Sinha**  
GitHub: [@adityasinha513](https://github.com/adityasinha513)

---


**Made with ❤️ for collaborative learning and live interaction**
