"use client"

import { useState, useEffect } from "react"
import "./GamePage.css"

function GamePage({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [tries, setTries] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimer, setBlockTimer] = useState(10)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    let timerId
    if (isBlocked) {
      if (blockTimer > 0) {
        timerId = setTimeout(() => setBlockTimer(blockTimer - 1), 1000)
      } else {
        setIsBlocked(false)
        setTries(0)
        setBlockTimer(10)
        setErrorMessage("")
      }
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTimer])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || timer === 0) return
    if (answer === "1") {
      setIsCorrect(true)
      setErrorMessage("")
    } else {
      setIsCorrect(false)
      const newTries = tries + 1
      setTries(newTries)
      if (newTries >= 3) {
        setIsBlocked(true)
        setErrorMessage("Too many tries! Please wait 10 seconds ⏳")
      } else {
        setErrorMessage("Incorrect clue input ❌")
      }
    }
  }

  return (
    <div className="game-container">
      {/* Timer Display */}
      <div className="timer-section">{TimerDisplay}</div>

      {/* Main Content */}
      <div className="content-box">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="puzzle-title">Logic Gate Puzzle</h1>
          <div className="challenge-badge">
            <span className="badge-icon">🧩</span>
            <span className="badge-text">Challenge 1</span>
          </div>
        </div>

        {/* Problem Section */}
        <div className="problem-section">
          <div className="problem-card">
            <h3 className="problem-title">
              <span className="problem-icon">⚡</span>
              Solve the Logic Expression
            </h3>
            <div className="logic-expression">
              <code className="expression-code">(A AND B) OR C</code>
            </div>
            <div className="variables-section">
              <h4 className="variables-title">Given Values:</h4>
              <div className="variables-grid">
                <div className="variable-item">
                  <span className="variable-name">A</span>
                  <span className="variable-value">1</span>
                </div>
                <div className="variable-item">
                  <span className="variable-name">B</span>
                  <span className="variable-value">0</span>
                </div>
                <div className="variable-item">
                  <span className="variable-name">C</span>
                  <span className="variable-value">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="answer-section">
          <form onSubmit={handleSubmit} className="answer-form">
            <div className="input-group">
              <label htmlFor="answer" className="input-label">
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="answer-input"
                disabled={isBlocked || timer === 0 || isCorrect}
                placeholder="Enter 0 or 1"
                maxLength={1}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={isBlocked || timer === 0 || isCorrect || !answer.trim()}
            >
              {isBlocked ? `Wait ${blockTimer}s` : "Submit Answer"}
            </button>
          </form>
        </div>

        {/* Status Section */}
        <div className="status-section">
          {errorMessage && (
            <div className="status-message error-message">
              <span className="status-icon">❌</span>
              <span className="status-text">
                {errorMessage} {isBlocked && ` (${blockTimer}s)`}
              </span>
            </div>
          )}

          {isCorrect && (
            <div className="status-message success-message">
              <span className="status-icon">✅</span>
              <span className="status-text">Correct! Click next to continue.</span>
            </div>
          )}

          {timer === 0 && (
            <div className="status-message timeout-message">
              <span className="status-icon">⏰</span>
              <span className="status-text">Time's up!</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="attempts-counter">
            <span className="counter-label">Attempts:</span>
            <div className="attempts-dots">
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`attempt-dot ${tries >= attempt ? "used" : ""}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="navigation-section">
          <button
            className={`next-button ${!isCorrect || timer === 0 ? "disabled" : ""}`}
            onClick={onNext}
            disabled={!isCorrect || timer === 0}
          >
            <span className="button-text">Go to Next Clue</span>
            <span className="button-icon">➡️</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <details className="help-details">
            <summary className="help-summary">
              <span className="help-icon">💡</span>
              Need Help?
            </summary>
            <div className="help-content">
              <p>
                <strong>Logic Gates:</strong>
              </p>
              <ul className="help-list">
                <li>
                  <code>AND</code>: Returns 1 only if both inputs are 1
                </li>
                <li>
                  <code>OR</code>: Returns 1 if at least one input is 1
                </li>
              </ul>
              <p>
                <strong>Tip:</strong> Solve step by step: First calculate (A AND B), then OR with C.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

export default GamePage
