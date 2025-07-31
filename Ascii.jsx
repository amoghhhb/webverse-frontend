"use client"

import { useState, useEffect } from "react"
import "./Ascii.css"

function Ascii({ onNext, timer, TimerDisplay }) {
  const [numberInput, setNumberInput] = useState("")
  const [result, setResult] = useState({ show: false, isCorrect: false })
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTime, setBlockTime] = useState(0)
<<<<<<< HEAD
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for hamburger menu

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
    if (isBlocked && blockTime > 0) {
      timerId = setTimeout(() => setBlockTime(blockTime - 1), 1000)
    } else if (blockTime === 0 && isBlocked) {
      setIsBlocked(false)
      setNumberInput("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTime])

  const checkAnswer = () => {
    if (isBlocked || timer === 0) return
    if (numberInput.trim() === "2") {
      setResult({ show: true, isCorrect: true })
      setAttempts(0)
    } else {
      setResult({ show: true, isCorrect: false })
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTime(penalty)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isBlocked && numberInput.trim() !== "" && timer > 0) {
      checkAnswer()
    }
  }

<<<<<<< HEAD
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="binary-workshop">
      {/* CORRECTED: Using "top-left-timer" class now */}
      <div className="top-left-timer">
        <span className="icon">⌛</span>
        <span>{formatTime(timer)}</span>
      </div>

      {/* Hamburger Menu Toggle */}
      <div className={`nav-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
        <div className="toggle-bar"></div>
      </div>

      {/* Information Panel */}
      <div className={`info-panel ${isMenuOpen ? "show" : ""}`}>
        <h3 className="panel-header">ASCII Hint</h3>
        <div className="info-item">
          <strong>Hint:</strong> Computers represent characters using a standard called ASCII. Each character, including numbers like "2", has a unique 8-bit binary code.
        </div>
      </div>

=======
  return (
    <div className="binary-workshop">
      {TimerDisplay}
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
      <div className="conversion-station">
        <h2>What number does this binary represent?:</h2>
        <p>
          <code className="binary-sequence">00110010</code>
        </p>
<<<<<<< HEAD
        <p className="conversion-hint">(The binary represents a single-digit character)</p>
=======
        <p className="conversion-hint">(The binary represents a single-digit number)</p>
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
        <div className="conversion-controls">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyPress={handleKeyPress}
<<<<<<< HEAD
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter decrypted answer"}
=======
            placeholder={isBlocked ? `Blocked (${blockTime}s)` : "Enter your decrypted answer here"}
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
            className="binary-decoder"
            disabled={isBlocked || timer === 0}
          />
        </div>
        <div className="control-panel">
          <button
            onClick={checkAnswer}
            disabled={isBlocked || numberInput.length === 0 || timer === 0}
            className={`decode-submit ${isBlocked || numberInput.length === 0 ? "disabled" : ""}`}
          >
            {isBlocked ? `⏳ ${blockTime}s` : "Submit"}
          </button>
        </div>
        {result.show && (
          <div className={`status-indicator ${result.isCorrect ? "success-indicator" : "error-indicator"}`}>
            {result.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </div>
        )}
        <section className="attempts-section">
          <div className="attempts-tracker">
            <span className="attempts-label">Attempts:</span>
            <div className="attempts-dots" role="img" aria-label={`${attempts} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div key={attempt} className={`attempts-dot ${attempts >= attempt ? "used" : ""}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>
        <button onClick={onNext} disabled={!result.isCorrect || timer === 0} className="workshop-next">
          Go to Next Clue ➡️
        </button>
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default Ascii
=======
export default Ascii
>>>>>>> 12d342421f26c5d71edaaaa84c9fe763152dc40f
