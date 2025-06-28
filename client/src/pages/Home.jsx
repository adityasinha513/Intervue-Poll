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
      }}
    >
      {/* Intervue Poll logo at the top */}
      <div style={{ marginBottom: 32 }}>
        <img
          src="/intervue-logo.png" // Make sure this file exists in your public folder
          alt="Intervue Poll Logo"
          style={{ width: 180, height: "auto" }}
        />
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16, color: "#333" }}>
        Welcome to the Live Polling System
      </h1>
      <div style={{ color: "#6b7280", marginBottom: 32, fontSize: 18 }}>
        Please select the role that best describes you to begin
      </div>
      <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
        <button
          onClick={() => setSelectedRole("student")}
          style={{
            padding: "24px 40px",
            borderRadius: 12,
            border: selectedRole === "student" ? "2px solid #6366f1" : "2px solid #e5e7eb",
            background: "#fff",
            fontWeight: 600,
            fontSize: 18,
            color: "#22223b",
            cursor: "pointer",
            boxShadow: selectedRole === "student" ? "0 2px 8px #6366f122" : "0 2px 8px #0001",
            transition: "border 0.2s, box-shadow 0.2s",
            outline: "none",
          }}
        >
          I'm a Student
        </button>
        <button
          onClick={() => setSelectedRole("teacher")}
          style={{
            padding: "24px 40px",
            borderRadius: 12,
            border: selectedRole === "teacher" ? "2px solid #22c55e" : "2px solid #e5e7eb",
            background: "#fff",
            fontWeight: 600,
            fontSize: 18,
            color: "#22223b",
            cursor: "pointer",
            boxShadow: selectedRole === "teacher" ? "0 2px 8px #22c55e22" : "0 2px 8px #0001",
            transition: "border 0.2s, box-shadow 0.2s",
            outline: "none",
          }}
        >
          I'm a Teacher
        </button>
      </div>
      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        style={{
          padding: "12px 48px",
          fontSize: 18,
          borderRadius: 24,
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          cursor: selectedRole ? "pointer" : "not-allowed",
          opacity: selectedRole ? 1 : 0.6,
          fontWeight: 700,
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default Home;
