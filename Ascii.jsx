import React, { useState, useEffect } from 'react';
import './Ascii.css';

function Ascii({ onNext, timer, TimerDisplay }) {
  const [numberInput, setNumberInput] = useState('');
  const [result, setResult] = useState({ show: false, isCorrect: false });
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000);
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false);
      setNumberInput('');
    }
    return () => clearTimeout(timerId);
  }, [isBlocked, blockTime]);

  const checkAnswer = () => {
    if (isBlocked || timer === 0) return;
    if (numberInput.trim() === '2') {
      setResult({ show: true, isCorrect: true });
      setAttempts(0);
    } else {
      setResult({ show: true, isCorrect: false });
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        const penalty = 10 + (5 * (newAttempts - 3));
        setIsBlocked(true);
        setBlockTime(penalty);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isBlocked && numberInput.trim() !== '' && timer > 0) {
      checkAnswer();
    }
  };

  return (
    <div className="ascii-container">
      {TimerDisplay}
      <div className="challenge-card">
        <h2>What number does this binary represent?:</h2>
        <p><code className="binary-display">00110010</code></p>
        <p className="hint-text">(The binary represents a single-digit number)</p>
        <div className="input-group">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your decrypted answer here"}
            className="ascii-input"
            disabled={isBlocked || timer === 0}
          />
        </div>
        <div className="button-group">
          <button
            onClick={checkAnswer}
            disabled={isBlocked || numberInput.length === 0 || timer === 0}
            className={`ascii-button ${isBlocked || numberInput.length === 0 ? 'disabled' : ''}`}
          >
            {isBlocked ? `⏳ ${blockTime}s` : 'Submit'}
          </button>
        </div>
        {result.show && (
          <div className={`feedback-message ${result.isCorrect ? 'feedback-success' : 'feedback-error'}`}>
            {result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </div>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!result.isCorrect || timer === 0}
        className="next-button"
      >
        Go to Next Clue ➡️
      </button>
      {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
    </div>
  );
}

export default Ascii;
