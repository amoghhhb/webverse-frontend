import React, { useState, useEffect } from "react";
import './CaesarCipherQuiz.css';

export default function CaesarCipherQuiz({ onNext, timer, TimerDisplay }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [resultColor, setResultColor] = useState("#fff");
  const [nextEnabled, setNextEnabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);
  const correctAnswer = "zero";

  useEffect(() => {
    let timerId;
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000);
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false);
      setUserAnswer("");
    }
    return () => clearTimeout(timerId);
  }, [isBlocked, blockTime]);

  const checkAnswer = () => {
    if (isBlocked || timer === 0) return;
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setResultMsg("✅ Correct! Well done!");
      setResultColor("#00ff00");
      setNextEnabled(true);
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3);
        setIsBlocked(true);
        setBlockTime(penalty);
        setResultMsg(`❌ Blocked for ${penalty} seconds. Try again later!`);
      } else {
        setResultMsg(`❌ Incorrect. Attempts left: ${3 - newAttempts}`);
      }
      setResultColor("#ff6b6b");
      setNextEnabled(false);
    }
  };

  return (
    <div className="game-container">
      {TimerDisplay}
      <div className="content-box">
        <h2 className="title">🔐 Caesar Cipher Decryption Quiz</h2>
        <div className="encrypted-message">
          <p>
            <strong>Encrypted Message:</strong><br />
            <code className="encrypted-code">chur</code>
          </p>
          <p className="shift-text">Shift: 3</p>
        </div>
        <input
          type="text"
          placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your decrypted answer here"}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isBlocked || timer === 0}
          className="answer-input"
        />
        <button
          onClick={checkAnswer}
          disabled={isBlocked || userAnswer.trim() === "" || timer === 0}
          className={`submit-button ${isBlocked || userAnswer.trim() === "" ? "disabled" : ""}`}
        >
          {isBlocked ? `⏳ ${blockTime}s` : "Submit"}
        </button>
        <p
          className={`result-message ${resultColor === "#ff6b6b" ? "error" : "success"}`}
          style={{ color: resultColor }}
        >
          {resultMsg}
        </p>
      </div>
      <button
        onClick={onNext}
        disabled={!nextEnabled || timer === 0}
        className={`next-button ${!nextEnabled ? "disabled" : ""}`}
      >
        Go to Next Clue ➡️
      </button>
      {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
    </div>
  );
}
