import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import ChatBox from "../components/ChatBox";

const Chat = ({ name }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const msg = { sender: name, text: input.trim(), time: new Date().toLocaleTimeString() };
      socket.emit("send_message", msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  return (
    <div style={{ background: "#f9f9fb", borderRadius: 12, padding: 16, maxWidth: 400, width: "100%" }}>
      <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Chat</h3>
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          background: "#fff",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          border: "1px solid #eee",
          fontSize: 15,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#aaa" }}>No messages yet.</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 600, color: "#7765DA" }}>{msg.sender}:</span>{" "}
              <span>{msg.text}</span>
              <span style={{ color: "#bbb", fontSize: 12, marginLeft: 8 }}>{msg.time}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 15
          }}
        />
        <button
          type="submit"
          style={{
            background: "#7765DA",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

// On server (Node.js/Socket.IO)
// io.on("connection", (socket) => {
//   socket.on("send_message", (msg) => {
//     socket.broadcast.emit("receive_message", msg);
//   });
// });