# 🎯 Intervue Poll - Live Polling System

A real-time live polling system for classrooms, interviews, or events. Teachers can create and manage polls, students can join, answer, and chat live. Built with React (frontend) and Node.js/Express + Socket.IO (backend).

![Intervue Poll](https://img.shields.io/badge/Intervue-Poll-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=for-the-badge&logo=socket.io)

## ✨ Features

### 🎓 Teacher Dashboard
- **Create & Launch Polls**: Create custom questions with multiple options
- **Real-time Results**: View live poll results as students answer
- **Timer Control**: Set custom time limits (30s to 120s)
- **Student Management**: Kick out disruptive students
- **Live Chat**: Communicate with students in real-time
- **Poll History**: View past polls and results
- **Correct Answer Marking**: Mark correct answers for assessment

### 👨‍🎓 Student Dashboard
- **Easy Join**: Simple name-based entry system
- **Interactive Polls**: Select answers with visual feedback
- **Real-time Timer**: Countdown timer with visual alerts
- **Live Chat**: Chat with teacher and classmates
- **Participants List**: See who's in the session
- **Results View**: See poll results after submission
- **Mobile Responsive**: Works perfectly on phones and tablets

### 🔄 Real-time Features
- **Instant Updates**: Real-time poll creation and results
- **Live Chat**: Instant messaging between teacher and students
- **Student Tracking**: Real-time participant list updates
- **Socket.IO**: WebSocket-based real-time communication

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel/Netlify](https://vercel.com) (Coming Soon)
- **Backend**: `https://intervue-poll-backend-qzi4.onrender.com`

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📱 Mobile Responsive

The application is fully optimized for mobile devices:
- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Mobile-First**: Designed with mobile users in mind
- **Progressive Web App**: Can be installed on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityasinha513/Intervue-Poll.git
   cd Intervue-Poll
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   Backend will run on `http://localhost:5000`

5. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `cd client && npm install && npm run build`
   - Set output directory: `client/dist`
   - Deploy!

3. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository
   - Set build command: `cd client && npm install && npm run build`
   - Set publish directory: `client/dist`
   - Deploy!

### Backend Deployment (Render/Railway)

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set root directory to `server`
   - Set build command: `npm install`
   - Set start command: `node index.js`
   - Deploy!

2. **Update Frontend Backend URL**
   - Update `client/src/socket.js` with your deployed backend URL
   - Redeploy frontend

## 📁 Project Structure

```
live-polling-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── socket.js      # Socket.IO configuration
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── vercel.json           # Vercel configuration
└── README.md             # Project documentation
```

## 🎯 Usage Guide

### For Teachers

1. **Access Teacher Dashboard**
   - Open the application
   - Click "I'm a Teacher"
   - You'll be taken to the teacher dashboard

2. **Create a Poll**
   - Enter your question (max 100 characters)
   - Add multiple options (minimum 2)
   - Set timer duration (30s to 120s)
   - Mark correct answers if applicable
   - Click "Ask Question"

3. **Monitor Results**
   - View real-time results as students answer
   - Use the chat to communicate with students
   - Manage participants list
   - View poll history

### For Students

1. **Join Session**
   - Open the application
   - Click "I'm a Student"
   - Enter your name
   - You'll join the live session

2. **Answer Polls**
   - Wait for teacher to create a poll
   - Select your answer from the options
   - Submit your response
   - View results after submission

3. **Interact**
   - Use the chat to communicate
   - View participants list
   - See real-time timer countdown

## 🔧 Configuration

### Environment Variables

Create `.env` files in both client and server directories:

**Server (.env)**
```env
PORT=5000
NODE_ENV=production
```

**Client (.env)**
```env
VITE_BACKEND_URL=https://your-backend-url.com
```

### Socket.IO Events

**Server Events:**
- `student_joined` - Student joins session
- `create_poll` - Teacher creates new poll
- `submit_answer` - Student submits answer
- `chat_message` - Chat message
- `kick_student` - Kick student from session

**Client Events:**
- `new_poll` - New poll created
- `poll_results` - Poll results update
- `student_list` - Participants list update
- `kicked` - Student kicked out

## 🐛 Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check if backend server is running
   - Verify backend URL in `client/src/socket.js`
   - Check CORS configuration

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Mobile Issues**
   - Ensure responsive design is working
   - Test on different screen sizes
   - Check touch interactions

### Development Tips

- Use browser dev tools to debug Socket.IO connections
- Check console for error messages
- Test on multiple devices and browsers
- Monitor network tab for API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aditya Sinha**
- GitHub: [@adityasinha513](https://github.com/adityasinha513)
- Project: [Intervue Poll](https://github.com/adityasinha513/Intervue-Poll)

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Vercel/Netlify for easy deployment
- Render for backend hosting

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Made with ❤️ for better classroom interactions** 