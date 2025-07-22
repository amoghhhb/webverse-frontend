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

  const handleSimulatorClick = () => {
    window.open("https://circuitverse.org/simulator", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="puzzle-container">
      {/* Timer Display */}
      <div className="timer-wrapper">{TimerDisplay}</div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <header className="game-header">
          <h1 className="game-title">Logic Gate Puzzle</h1>
          <div className="level-badge">
            <span className="level-icon" role="img" aria-label="puzzle">
              🧩
            </span>
            <span className="badge-text">Challenge 1</span>
          </div>
        </header>

        {/* Problem Section */}
        <section className="puzzle-problem">
          <div className="problem-container">
            <h2 className="problem-heading">
              <span className="problem-emoji" role="img" aria-label="lightning">
                ⚡
              </span>
              <span>Solve the Logic Expression</span>
            </h2>
            <div className="expression-display">
              <code className="code-expression" aria-label="Logic expression: A AND B OR C">
                (A AND B) OR C
              </code>
            </div>
            <div className="values-section">
              <h3 className="values-heading">Given Values:</h3>
              <div className="values-display" role="list" aria-label="Variable values">
                <div className="value-pair" role="listitem">
                  <span className="value-label">A =</span>
                  <span className="value-number" aria-label="A equals 1">
                    1
                  </span>
                </div>
                <div className="value-pair" role="listitem">
                  <span className="value-label">B =</span>
                  <span className="value-number" aria-label="B equals 0">
                    0
                  </span>
                </div>
                <div className="value-pair" role="listitem">
                  <span className="value-label">C =</span>
                  <span className="value-number" aria-label="C equals 1">
                    1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Answer Section */}
        <section className="input-section">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="form-group">
              <label htmlFor="answer" className="form-label">
                Your Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="text-input"
                disabled={isBlocked || timer === 0 || isCorrect}
                placeholder="0 or 1"
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

            {/* Circuit Simulator Helper Button */}
            <button
              type="button"
              className="helper-button"
              onClick={handleSimulatorClick}
              aria-label="Open CircuitVerse simulator in new tab"
            >
              <span className="helper-icon" role="img" aria-hidden="true">
                🔧
              </span>
              <span>Circuit Simulator</span>
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isBlocked || timer === 0 || isCorrect || !answer.trim()}
              aria-describedby="submit-status"
            >
              {isBlocked ? `Wait ${blockTimer}s` : "Submit Answer"}
            </button>
          </form>
        </section>

        {/* Status Section */}
        <section className="feedback-section" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <div className="feedback-message error-feedback" role="alert">
              <span className="feedback-icon" aria-hidden="true">
                ❌
              </span>
              <span className="feedback-text">
                {errorMessage} {isBlocked && ` (${blockTimer}s)`}
              </span>
            </div>
          )}

          {isCorrect && (
            <div className="feedback-message success-feedback" role="alert">
              <span className="feedback-icon" aria-hidden="true">
                ✅
              </span>
              <span className="feedback-text">Correct! Click next to continue.</span>
            </div>
          )}

          {timer === 0 && (
            <div className="feedback-message timeout-feedback" role="alert">
              <span className="feedback-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="feedback-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        {/* Progress Section */}
        <section className="attempts-section">
          <div className="attempts-display">
            <span className="attempts-label">Attempts:</span>
            <div className="dots-container" role="img" aria-label={`${tries} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div
                  key={attempt}
                  className={`attempt-indicator ${tries >= attempt ? "used" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="action-section">
          <button
            className={`action-button ${!isCorrect || timer === 0 ? "disabled" : ""}`}
            onClick={onNext}
            disabled={!isCorrect || timer === 0}
            aria-describedby="next-help"
          >
            <span className="action-text">Go to Next Clue</span>
            <span className="action-icon" aria-hidden="true">
              ➡️
            </span>
          </button>
          <div id="next-help" className="sr-only">
            Available only after answering correctly and within time limit
          </div>
        </section>
      </div>
    </div>
  )
}

export default GamePage
