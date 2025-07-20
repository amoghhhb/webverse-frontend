import React, { useState } from 'react';
import './ExtensionPuzzle.css';

const ExtensionPuzzle = ({ timer, TimerDisplay, onNext }) => { // Added onNext prop
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    if (timer === 0) return;
    if (answer.trim() === '5') {
      setResult('✅ Correct! These are executable: .exe, .com, .cmd, .bat, .scr');
      setIsCorrect(true);
      setShowNextButton(true);
    } else {
      setResult('❌ Incorrect! Try again.');
      setIsCorrect(false);
      setShowNextButton(false);
    }
  };

  return (
    <div className="extension-container">
      {TimerDisplay}
      <div className="extension-card">
        <h1 className="extension-title">🧠 Extension Decoding Challenge</h1>
        <div className="extension-puzzle-text">
          Out of the following file types,<br />
          how many are executable?
        </div>
        <div className="extension-list">
          .html, .exe, .com, .jpg, .cmd, .pdf, .bat, .scr
        </div>
        <input
          type="number"
          className="extension-input"
          placeholder="?"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={timer === 0}
        />
        <div
          className={`extension-result ${
            isCorrect ? "feedback-success" : "feedback-error"
          }`}
        >
          {result}
        </div>
        <button
          className="extension-button"
          onClick={checkAnswer}
          disabled={answer.trim() === "" || timer === 0}
        >
          Submit
        </button>
        {showNextButton && (
          <button
            className="extension-button extension-final-button"
            onClick={onNext} // Added onClick handler here
          >
            Click to Continue
          </button>
        )}
        <div className="extension-footer">
          🧐 Hint: Think like an OS. Which ones can actually run?
        </div>
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  );
};

export default ExtensionPuzzle;