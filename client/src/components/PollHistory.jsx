import React from "react";
import PollHistory from "../components/PollHistory";

const PollHistoryPage = ({ history = [], showHistory }) => (
  <div style={{ maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: 24 }}>Poll History</h2>
    {showHistory && (
      <PollHistory polls={history} />
    )}
  </div>
);

export default PollHistoryPage;