import { io } from 'socket.io-client';

// Use deployed backend URL in production, localhost in development
const backendUrl = import.meta.env.PROD 
  ? 'https://intervue-poll-backend-qzi4.onrender.com'
  : 'http://localhost:5000';

export const socket = io(backendUrl);
