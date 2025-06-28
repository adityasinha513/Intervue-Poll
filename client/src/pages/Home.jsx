import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "teacher") navigate("/teacher");
    if (selectedRole === "student") navigate("/student");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fc",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Intervue Poll logo at the top */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <img
          src="/intervue-logo.png"
          alt="Intervue Poll Logo"
          style={{ 
            width: "min(180px, 40vw)", 
            height: "auto",
            maxWidth: "180px"
          }}
        />
      </div>
      
      <h1 style={{ 
        fontSize: "clamp(1.5rem, 5vw, 2.5rem)", 
        fontWeight: 800, 
        marginBottom: "16px", 
        color: "#333",
        textAlign: "center",
        lineHeight: "1.2"
      }}>
        Welcome to the Live Polling System
      </h1>
      
      <div style={{ 
        color: "#6b7280", 
        marginBottom: "32px", 
        fontSize: "clamp(16px, 4vw, 18px)",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        Please select the role that best describes you to begin
      </div>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: "16px", 
        marginBottom: "32px",
        width: "100%",
        maxWidth: "400px"
      }}>
        <button
          onClick={() => setSelectedRole("student")}
          style={{
            padding: "20px 24px",
            borderRadius: "12px",
            border: selectedRole === "student" ? "2px solid #6366f1" : "2px solid #e5e7eb",
            background: "#fff",
            fontWeight: 600,
            fontSize: "clamp(16px, 4vw, 18px)",
            color: "#22223b",
            cursor: "pointer",
            boxShadow: selectedRole === "student" ? "0 2px 8px #6366f122" : "0 2px 8px #0001",
            transition: "border 0.2s, box-shadow 0.2s",
            outline: "none",
            width: "100%",
            minHeight: "60px"
          }}
        >
          I'm a Student
        </button>
        <button
          onClick={() => setSelectedRole("teacher")}
          style={{
            padding: "20px 24px",
            borderRadius: "12px",
            border: selectedRole === "teacher" ? "2px solid #22c55e" : "2px solid #e5e7eb",
            background: "#fff",
            fontWeight: 600,
            fontSize: "clamp(16px, 4vw, 18px)",
            color: "#22223b",
            cursor: "pointer",
            boxShadow: selectedRole === "teacher" ? "0 2px 8px #22c55e22" : "0 2px 8px #0001",
            transition: "border 0.2s, box-shadow 0.2s",
            outline: "none",
            width: "100%",
            minHeight: "60px"
          }}
        >
          I'm a Teacher
        </button>
      </div>
      
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        style={{
          padding: "16px 48px",
          fontSize: "clamp(16px, 4vw, 18px)",
          borderRadius: "24px",
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          cursor: selectedRole ? "pointer" : "not-allowed",
          opacity: selectedRole ? 1 : 0.6,
          fontWeight: 700,
          minHeight: "56px",
          minWidth: "140px"
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default Home;
