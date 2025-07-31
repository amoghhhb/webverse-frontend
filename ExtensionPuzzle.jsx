"use client"

import { useState } from "react"
import "./ExtensionPuzzle.css"

const ExtensionPuzzle = ({ timer, TimerDisplay, onNext }) => {
  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState("")
  const [showNextButton, setShowNextButton] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)
<<<<<<< HEAD
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const checkAnswer = (e) => {
=======

  const checkAnswer = (e) => {
    // Prevent form submission and scrolling
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
    if (e) {
      e.preventDefault()
    }

    if (timer === 0) return
    if (answer.trim() === "5") {
      setResult("✅ Correct! These are executable: .exe, .com, .cmd, .bat, .scr")
      setIsCorrect(true)
      setShowNextButton(true)
<<<<<<< HEAD
      setAttempts(0)
=======
      setAttempts(0) // Reset attempts on success
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setResult("❌ Incorrect! Try again.")
      setIsCorrect(false)
      setShowNextButton(false)
    }
  }

  return (
    <div className="file-lab">
<<<<<<< HEAD
      <div className="top-left-timer">
        <span className="icon">⌛</span>
        <span>{formatTime(timer)}</span>
      </div>

      <div className={`nav-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
      </div>

      <div className={`info-panel ${isMenuOpen ? "show" : ""}`}>
        <h3 className="panel-header">Extension Puzzle Hint</h3>
        <div className="info-item">
          <strong>Hint:</strong> Executable files are programs that can be run directly by the operating system. 
          Common executable extensions include .exe, .com, .bat, etc.
        </div>
      </div>

=======
      {TimerDisplay}
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
      <div className="lab-workstation">
        <h1 className="lab-banner">🧠 Extension Decoding Challenge</h1>
        <div className="challenge-prompt">
          Out of the following file types,
          <br />
          how many are executable?
        </div>
        <div className="file-catalog">.html, .exe, .com, .jpg, .cmd, .pdf, .bat, .scr</div>
        <form onSubmit={checkAnswer} style={{ display: "contents" }}>
          <input
            type="number"
            className="analysis-field"
            placeholder="?"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={timer === 0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                checkAnswer()
              }
            }}
          />
          <div className={`status-indicator ${isCorrect ? "success-indicator" : result ? "error-indicator" : ""}`}>
            {result}
          </div>
          <section className="attempts-section">
            <div className="attempts-tracker">
              <span className="attempts-label">Attempts:</span>
              <div className="attempts-dots" role="img" aria-label={`${attempts} out of 3 attempts used`}>
                {[1, 2, 3].map((attempt) => (
                  <div
                    key={attempt}
                    className={`attempts-dot ${attempts >= attempt ? "used" : ""}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </section>
          <button
            type="button"
            className="analyze-btn"
            onClick={(e) => {
              e.preventDefault()
              checkAnswer()
            }}
            disabled={answer.trim() === "" || timer === 0}
          >
            Submit
          </button>
        </form>
        {showNextButton && (
          <button className="analyze-btn advance-btn" onClick={onNext}>
            Click to Continue
          </button>
        )}
        {!isCorrect && <div className="lab-hint">🧐 Hint: Think like an OS. Which ones can actually run?</div>}
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default ExtensionPuzzle
=======
export default ExtensionPuzzle
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
