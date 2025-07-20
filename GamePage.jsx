import React, { useState, useEffect } from "react";
import "./GamePage.css";

function GamePage({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tries, setTries] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(10);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    let timerId;
    if (isBlocked) {
      if (blockTimer > 0) {
        timerId = setTimeout(() => setBlockTimer(blockTimer - 1), 1000);
      } else {
        setIsBlocked(false);
        setTries(0);
        setBlockTimer(10);
        setErrorMessage('');
      }
    }
    return () => clearTimeout(timerId);
  }, [isBlocked, blockTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBlocked || timer === 0) return;
    if (answer === "1") {
      setIsCorrect(true);
      setErrorMessage('');
    } else {
      setIsCorrect(false);
      const newTries = tries + 1;
      setTries(newTries);
      if (newTries >= 3) {
        setIsBlocked(true);
        setErrorMessage('Too many tries! Please wait 10 seconds ⏳');
      } else {
        setErrorMessage('Incorrect clue input ❌');
      }
    }
  };

  return (
    <div className="game-container">
      {TimerDisplay}
      <div className="content-box">
        <h2>Logic Gate Puzzle</h2>
        <div>
          <p>Solve: (A AND B) OR C where A = 1, B = 0, C = 1</p>
        </div>
        <form onSubmit={handleSubmit} className="answer-form">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="answer-input"
            disabled={isBlocked || timer === 0 || isCorrect}
            placeholder="Your answer"
          />
          <button
            type="submit"
            className="submit-button"
            disabled={isBlocked || timer === 0 || isCorrect}
          >
            Submit Answer
          </button>
        </form>
        {errorMessage && (
          <p className="error-message">
            {errorMessage} {isBlocked && ` (${blockTimer}s)`}
          </p>
        )}
        {isCorrect && (
          <p className="success-message">
            ✅ Correct! Click next to continue.
          </p>
        )}
        <button
          className={`next-button${!isCorrect || timer === 0 ? " disabled" : ""}`}
          onClick={onNext}
          disabled={!isCorrect || timer === 0}
        >
          Go to Next Clue ➡️
        </button>
        {timer === 0 && (
          <p style={{ color: "#e55", fontWeight: "bold" }}>
            ⏰ Time's up!
          </p>
        )}
      </div>
    </div>
  );
}

export default GamePage;
