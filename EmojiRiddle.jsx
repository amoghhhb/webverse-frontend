"use client"

import { useState, useRef, useEffect } from "react"
import "./EmojiRiddle.css"

export default function EmojiRiddle({ onNext, timer, TimerDisplay }) {
  const [word1, setWord1] = useState("")
  const [word2, setWord2] = useState("")
  const [word3, setWord3] = useState("")
  const [resultMsg, setResultMsg] = useState("Total: 0")
  const [resultColor, setResultColor] = useState("#fff")
  const [isNextDisabled, setIsNextDisabled] = useState(true)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const input2Ref = useRef(null)
  const input3Ref = useRef(null)
  const submitBtnRef = useRef(null)

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  useEffect(() => {
    let timerId = null
    if (isBlocked && blockTimeLeft > 0) {
      timerId = setTimeout(() => setBlockTimeLeft((prev) => prev - 1), 1000)
    } else if (isBlocked && blockTimeLeft === 0) {
      setIsBlocked(false)
      setResultMsg("⏱️ You can try again now.")
      setResultColor("#fff")
    }
    return () => clearTimeout(timerId)
  }, [isBlocked, blockTimeLeft])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const updateResult = () => {
    if (isBlocked || timer === 0) return

    const answer1 = word1.trim().toLowerCase()
    const answer2 = word2.trim().toLowerCase()
    const answer3 = word3.trim().toLowerCase()

    if (answer1 === "run" && answer2 === "on" && answer3 === "web") {
      setResultMsg("✅ Correct! Total: 8")
      setResultColor("#00ff00")
      setIsNextDisabled(false)
      setWrongAttempts(0)
      setIsCorrect(true)
    } else {
      const newAttempts = wrongAttempts + 1
      setWrongAttempts(newAttempts)
      setResultMsg(`❌ Incorrect. Total: ${word1.trim().length + word2.trim().length + word3.trim().length}`)
      setResultColor("#ff3333")
      setIsNextDisabled(true)

      if (newAttempts >= 3) {
        const blockDuration = 10 + 5 * (newAttempts - 3)
        setIsBlocked(true)
        setBlockTimeLeft(blockDuration)
        setResultMsg(`⏳ Too many wrong attempts. Try again in ${blockDuration} second${blockDuration > 1 ? "s" : ""}.`)
        setResultColor("#ff0000ff")
      }
    }
  }

  const handleKey = (e, nextRef) => {
    if (e.key === "Enter" || e.target.value.length === e.target.maxLength) {
      e.preventDefault()
      if (nextRef && nextRef.current) {
        nextRef.current.focus()
      }
    }
  }

  return (
    <div className="symbol-chamber">
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
        <h3 className="panel-header">Emoji Riddle Hint</h3>
        <div className="info-item">
          <strong>Hint:</strong> Each emoji represents a word. Combine all three words to form 
          a common phrase related to web development.
        </div>
      </div>

      <div className="chamber-content">
        <header className="riddle-header">
          <h1 className="chamber-title">Emoji Riddle Puzzle</h1>
          <div className="riddle-badge">
            <span className="riddle-icon" role="img" aria-label="puzzle">
              🌐
            </span>
            <span className="riddle-label">Challenge 2</span>
          </div>
        </header>

        <section className="symbol-problem">
          <div className="symbol-workspace">
            <h2 className="symbol-heading">
              <span className="symbol-emoji" role="img" aria-label="lightbulb">
                💡
              </span>
              <span>Decode the Emoji Sequence</span>
            </h2>
            <div className="symbol-showcase">
              <div className="emoji-formula" aria-label="Emoji sequence: running person, on symbol, spider web">
                🏃🏻‍♀ + 🔛 + 🕸
              </div>
            </div>
          </div>
        </section>

        <section className="word-section">
          <div className="word-inputs">
            <div className="word-group">
              <input
                type="text"
                maxLength={10}
                value={word1}
                onChange={(e) => setWord1(e.target.value)}
                onKeyDown={(e) => handleKey(e, input2Ref)}
                disabled={isBlocked || timer === 0 || isCorrect}
                className="word-field first-word"
                placeholder="Word 1"
                aria-label="First word"
              />
              <div className="word-counter">{word1.trim().length} letters</div>
            </div>

            <div className="word-separator">+</div>

            <div className="word-group">
              <input
                ref={input2Ref}
                type="text"
                maxLength={10}
                value={word2}
                onChange={(e) => setWord2(e.target.value)}
                onKeyDown={(e) => handleKey(e, input3Ref)}
                disabled={isBlocked || timer === 0 || isCorrect}
                className="word-field second-word"
                placeholder="Word 2"
                aria-label="Second word"
              />
              <div className="word-counter">{word2.trim().length} letters</div>
            </div>

            <div className="word-separator">+</div>

            <div className="word-group">
              <input
                ref={input3Ref}
                type="text"
                maxLength={10}
                value={word3}
                onChange={(e) => setWord3(e.target.value)}
                onKeyDown={(e) => handleKey(e, submitBtnRef)}
                disabled={isBlocked || timer === 0 || isCorrect}
                className="word-field third-word"
                placeholder="Word 3"
                aria-label="Third word"
              />
              <div className="word-counter">{word3.trim().length} letters</div>
            </div>
          </div>

          <div className="word-form">
            <button
              ref={submitBtnRef}
              onClick={updateResult}
              disabled={isBlocked || timer === 0 || isCorrect}
              className="word-submit"
              type="button"
            >
              {isBlocked ? `Wait ${blockTimeLeft}s` : isCorrect ? "Submitted" : "Submit Answer"}
            </button>
          </div>
        </section>

        <section className="result-section" aria-live="polite" aria-atomic="true">
          <div
            className={`status-indicator ${resultColor === "#00ff00" ? "success-indicator" : resultColor === "#ff3333" || resultColor === "#ff0000ff" ? "error-indicator" : ""}`}
            role="alert"
          >
            <span className="result-text">{resultMsg}</span>
          </div>

          {timer === 0 && (
            <div className="status-indicator error-indicator" role="alert">
              <span className="timeout-icon" aria-hidden="true">
                ⏰
              </span>
              <span className="timeout-text">{"Time's up!"}</span>
            </div>
          )}
        </section>

        <section className="tries-section">
          <div className="tries-tracker">
            <span className="tries-label">Attempts:</span>
            <div className="tries-dots" role="img" aria-label={`${wrongAttempts} out of 3 attempts used`}>
              {[1, 2, 3].map((attempt) => (
                <div
                  key={attempt}
                  className={`tries-dot ${wrongAttempts >= attempt ? "used" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="advance-section">
          <button
            className={`advance-button ${isNextDisabled || timer === 0 ? "disabled" : ""}`}
            onClick={onNext}
            disabled={isNextDisabled || timer === 0}
            aria-describedby="next-help"
          >
            <span className="advance-text">Go to Next Clue</span>
            <span className="advance-arrow" aria-hidden="true">
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