import React, { useState, useEffect } from "react";
import "./InspectPage.css";

function InspectPage({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^[0-9]*$/.test(val)) {
      setAnswer(val);
      setError("");
      setSuccessMsg("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBlocked || answer === "" || timer === 0) return;

    if (answer === "2") {
      setIsVerified(true);
      setError("");
      setSuccessMsg("✅ Access granted! Clue accepted.");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setSuccessMsg("");

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3);
        setIsBlocked(true);
        setTimeLeft(penalty);
        setError(`❌ Locked for ${penalty} seconds`);
      } else {
        setError(
          `❌ Incorrect. ${3 - newAttempts} attempt${
            3 - newAttempts === 1 ? "" : "s"
          } left.`
        );
      }
    }
  };

  useEffect(() => {
    let timerId;
    if (isBlocked && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isBlocked && timeLeft === 0) {
      setIsBlocked(false);
      setAnswer("");
      setError("");
      setSuccessMsg("");
    }
    return () => clearTimeout(timerId);
  }, [isBlocked, timeLeft]);

  return (
    <div className="game-container">
      {TimerDisplay}
      <h1 className="clue-header">INSPECT TILL YOU SUSPECT 🕵️</h1>
      <div className="content-box">
        <p className="logic-problem">Discover the hidden verification code:</p>
        <form onSubmit={handleSubmit} className="answer-form">
          <div className="input-group">
            <input
              type="number"
              value={answer}
              onChange={handleInputChange}
              disabled={isBlocked || isVerified || timer === 0}
              placeholder="Enter The Discovered Code"
              className="answer-input"
            />
            <button
              type="submit"
              disabled={isBlocked || answer === "" || isVerified || timer === 0}
              className="submit-button"
            >
              {isBlocked ? `⏳ ${timeLeft}s` : "Verify"}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {successMsg && <p className="success-message">{successMsg}</p>}
        </form>
        {/* Subtle hint, visible but faint */}
        <p style={{ color: "#222", fontSize: "12px", opacity: 0.23, marginTop: "18px", userSelect: "none" }}>
          Sometimes, the answer is as simple as 1 + 1.
        </p>
        <button
          className="next-button"
          onClick={onNext}
          disabled={!isVerified || timer === 0}
        >
          Go to Next Clue ➡️
        </button>
        {timer === 0 && (
          <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>
        )}
      </div>
    </div>
  );
}

export default InspectPage;
