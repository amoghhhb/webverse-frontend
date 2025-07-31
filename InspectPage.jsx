"use client"

import { useState, useEffect } from "react"
import "./InspectPage.css"

function InspectPage({ onNext, timer, TimerDisplay }) {
  const [answer, setAnswer] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
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

  const handleInputChange = (e) => {
    const val = e.target.value
    if (/^[0-9]*$/.test(val)) {
      setAnswer(val)
      setError("")
      setSuccessMsg("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isBlocked || answer === "" || timer === 0) return

    if (answer === "2") {
      setIsVerified(true)
      setError("")
      setSuccessMsg("✅ Access granted! Clue accepted.")
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setSuccessMsg("")

      if (newAttempts >= 3) {
        const penalty = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setTimeLeft(penalty)
        setError(`❌ Locked for ${penalty} seconds`)
      } else {
        setError(`❌ Incorrect. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? "" : "s"} left.`)
      }
    }
  }

  useEffect(() => {
    let timerId
    if (isBlocked && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    } else if (isBlocked && timeLeft === 0) {
      setIsBlocked(false)
      setAnswer("")
      setError("")
      setSuccessMsg("")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, timeLeft])

  const getContainerClass = () => {
    if (isVerified) return "investigation-panel success-container"
    if (error) return "investigation-panel error-container"
    return "investigation-panel"
  }

  return (
    <div className="detective-wrapper">
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
        <h3 className="panel-header">Inspect Page Hint</h3>
        <div className="info-item">
          <strong>Hint:</strong> Sometimes the answer is hidden in plain sight. Try inspecting 
          the page elements carefully.
        </div>
      </div>

      <div className={getContainerClass()}>
        <h1 className="mystery-title">INSPECT TILL YOU SUSPECT 🕵️</h1>
        <p className="riddle-text">Discover the hidden verification code:</p>
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-input-section">
            <input
              type="number"
              value={answer}
              onChange={handleInputChange}
              disabled={isBlocked || isVerified || timer === 0}
              placeholder="Enter The Discovered Code"
              className="secret-code-field"
            />
            <button
              type="submit"
              disabled={isBlocked || answer === "" || isVerified || timer === 0}
              className="verify-btn"
            >
              {isBlocked ? `⏳ ${timeLeft}s` : "Verify"}
            </button>
          </div>
          {error && <div className="status-indicator error-indicator">{error}</div>}
          {successMsg && <div className="status-indicator success-indicator">{successMsg}</div>}
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
        </form>
        <p
          style={{
            color: "#222",
            fontSize: "12px",
            opacity: 0.23,
            marginTop: "18px",
            userSelect: "none",
            display: "none",
          }}
        >
          Sometimes, the answer is as simple as 1 + 1.
        </p>
        <button className="proceed-btn" onClick={onNext} disabled={!isVerified || timer === 0}>
          Go to Next Clue ➡️
        </button>
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  )
}

export default InspectPage