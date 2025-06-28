# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Intervue Poll

A real-time live polling system for classrooms, interviews, or events. Teachers can create and manage polls, students can join, answer, and chat live. Built with React (frontend) and Node.js/Express + Socket.IO (backend).

---

## Features

- **Teacher Dashboard:**  
  - Create, launch, and end polls  
  - View live results and poll history  
  - Kick students  
  - Real-time chat with students

- **Student Dashboard:**  
  - Join polls with your name  
  - Answer live questions  
  - See results after submission  
  - Real-time chat with teacher and classmates

- **Poll History:**  
  - Teachers can view past polls and winning options

- **Responsive UI:**  
  - Works on desktop and mobile

---

## Tech Stack

- **Frontend:** React, Socket.IO-client
- **Backend:** Node.js, Express, Socket.IO
- **Deployment:** [Render](https://render.com/) / [Railway](https://railway.app/) / [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/adityasinha513/Intervue-Poll.git
cd Intervue-Poll
```

# Live Polling System - Frontend

This is the React frontend for the Live Polling System.

## Deployment

This frontend is designed to be deployed on Vercel, Netlify, or Render.

### Build Commands
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
- `VITE_BACKEND_URL`: Backend URL (optional, defaults to deployed URL)

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview