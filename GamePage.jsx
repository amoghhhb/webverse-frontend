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
<<<<<<< HEAD
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Helper function to format the time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };
=======
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f

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
<<<<<<< HEAD
  
=======
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f

  const handleSimulatorClick = () => {
    window.open("https://circuitverse.org/simulator", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="logic-arena">
<<<<<<< HEAD
      {/* CORRECTED: Using "top-left-timer" class now */}
      <div className="top-left-timer">
        <span className="icon">⌛</span>
        <span>{formatTime(timer)}</span>
      </div>

      <div
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          aria-label="Toggle menu"
        >
          <div className="toggle-bar"></div>
          <div className="toggle-bar"></div>
          <div className="toggle-bar"></div>
        </div>

        <div className={`info-panel ${isMenuOpen ? "show" : ""}`}>
          <h3 className="panel-header">🎮 Game Information</h3>
          <div className="info-item">
            <strong>Instructions:</strong> Enter your full name and class/department and click START to begin the game.
          </div>
          <div className="info-item">
            <strong>Objective:</strong> Test your web development knowledge and speed
          </div>
          <div className="info-item">
            <strong>Scoring:</strong> Based on accuracy and completion time
          </div>
          <div className="info-item">
            <strong>Leaderboard:</strong> Compete with other players globally
          </div>
        </div>
=======
      <div className="countdown-display">{TimerDisplay}</div>
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f

      <div className="arena-content">
        <header className="challenge-header">
          <h1 className="arena-title">Logic Gate Puzzle</h1>
        </header>

        <section className="logic-problem">
          <div className="problem-workspace">
            <h2 className="workspace-heading">
              <span className="workspace-emoji" role="img" aria-label="lightning">
                ⚡
              </span>
              <span>Solve the Logic Expression</span>
            </h2>
            <div className="formula-showcase">
              <code className="logic-formula" aria-label="Logic expression: A AND B OR C">
                (A AND B) OR C
              </code>
            </div>
            <div className="variables-section">
              <h3 className="variables-heading">Given Values:</h3>
              <div className="variables-grid" role="list" aria-label="Variable values">
                <div className="variable-item" role="listitem">
                  <span className="variable-name">A =</span>
                  <span className="variable-digit" aria-label="A equals 1">
                    1
                  </span>
                </div>
                <div className="variable-item" role="listitem">
                  <span className="variable-name">B =</span>
                  <span className="variable-digit" aria-label="B equals 0">
                    0
                  </span>
                </div>
                <div className="variable-item" role="listitem">
                  <span className="variable-name">C =</span>
                  <span className="variable-digit" aria-label="C equals 1">
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="response-section">
          <form onSubmit={handleSubmit} className="response-form">
            <div className="response-group">
              <label htmlFor="answer" className="response-label">
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="response-field"
                disabled={isBlocked || timer === 0 || isCorrect}
                placeholder=""
                maxLength={1}
                pattern="[01]"
                inputMode="numeric"
                aria-describedby="answer-help"
                autoComplete="off"
              />
              <div id="answer-help" className="sr-only">
                Enter either 0 or 1 as your answer to the logic expression
              </div>
            </div>

            <button
              type="button"
              className="tool-btn"
              onClick={handleSimulatorClick}
              aria-label="Open CircuitVerse simulator in new tab"
            >
              <span className="tool-icon" role="img" aria-hidden="true">
                🔧
              </span>
              <span>Circuit Simulator</span>
            </button>
          </form>
        </section>

        <section className="button-row-section">
          <div className="button-container">
            <button
              type="button"
              className="solve-btn"
              onClick={handleSubmit}
              disabled={isBlocked || timer === 0 || isCorrect || !answer.trim()}
              aria-describedby="submit-status"
            >
              {isBlocked ? `Wait ${blockTimer}s` : "Submit"}
            </button>

            <button
<<<<<<< HEAD
              className={`Maps-btn ${!isCorrect || timer === 0 ? "disabled" : ""}`}
=======
              className={`navigate-btn ${!isCorrect || timer === 0 ? "disabled" : ""}`}
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
              onClick={onNext}
              disabled={!isCorrect || timer === 0}
              aria-describedby="next-help"
            >
              <span className="navigate-text">Go to Next Clue</span>
              <span className="navigate-icon" aria-hidden="true">
                ➡️
              </span>
            </button>
          </div>
          <div id="next-help" className="sr-only">
            Available only after answering correctly and within time limit
          </div>
        </section>

        <section className="status-section" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <div className="status-alert error-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ❌
              </span>
              <span className="alert-text">
                {errorMessage} {isBlocked && ` (${blockTimer}s)`}
              </span>
            </div>
          )}

          {isCorrect && (
            <div className="status-alert success-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ✅
              </span>
              <span className="alert-text">Correct! Click next to continue.</span>
            </div>
          )}

          {timer === 0 && (
            <div className="status-alert timeout-alert" role="alert">
              <span className="alert-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="alert-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        <section className="progress-section">
          <div className="progress-tracker">
            <span className="tracker-label">Attempts:</span>
            <div className="progress-dots" role="img" aria-label={`${tries} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`progress-dot ${tries >= attempt ? "used" : ""}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default GamePage
=======
export default GamePage
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
