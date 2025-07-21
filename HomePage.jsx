"use client"

import { useState } from "react"
import "./HomePage.css"

function HomePage({ onNext }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fullName, setFullName] = useState("")
  const [department, setDepartment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleStart = async (e) => {
    e.preventDefault()

    if (!fullName.trim() || !department.trim()) {
      alert("Please enter your full name AND class/department.")
      return
    }

    setIsLoading(true)

    try {
      // 🔥 Send to /submit
      const res = await fetch("https://webverse-production.up.railway.app/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          department: department.trim(),
        }),
      })

      const data = await res.json()
      // console.log('Server response:', data);

      // Proceed to the next step
      onNext({
        name: fullName.trim(),
        department: department.trim(),
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="game-container">
        {/* Hamburger Menu */}
        <div
          className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          aria-label="Toggle menu"
        >
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>

        {/* Menu Content */}
        <div className={`menu-content ${isMenuOpen ? "show" : ""}`}>
          <h3 className="menu-title">🎮 Game Information</h3>
          <div className="menu-item">
            <strong>Instructions:</strong> Enter your full name and class/department and click START to begin the game.
          </div>
          <div className="menu-item">
            <strong>Objective:</strong> Test your web development knowledge and speed
          </div>
          <div className="menu-item">
            <strong>Scoring:</strong> Based on accuracy and completion time
          </div>
          <div className="menu-item">
            <strong>Leaderboard:</strong> Compete with other players globally
          </div>
        </div>

        {/* Main Content */}
        <div className="game-content">
          {/* Header Section */}
          <div className="header-section">
            <h1 className="welcome-text">WELCOME TO</h1>
            <h1 className="game-text">THE GAME</h1>
            <p className="subtitle">Test your skills and climb the leaderboard</p>
          </div>

          {/* Game Info */}
          <div className="game-info">
            <h3 className="info-title">
              <span>🏆</span>
              Game Features
            </h3>
            <ul className="info-list">
              <li className="info-item">
                <span className="info-icon">⚡</span>
                Real-time challenges
              </li>
              <li className="info-item">
                <span className="info-icon">🎯</span>
                Skill-based scoring
              </li>
              <li className="info-item">
                <span className="info-icon">📊</span>
                Global leaderboard
              </li>
              <li className="info-item">
                <span className="info-icon">🏅</span>
                Achievement system
              </li>
            </ul>
          </div>

          {/* Form Section */}
          <form onSubmit={handleStart} className="form-section">
            <div className="input-group name-input-container">
              <label htmlFor="fullName" className="input-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullname"
                className="form-input name-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
                maxLength={50}
                required
              />
            </div>

            <div className="input-group department-input-container">
              <label htmlFor="department" className="input-label">
                Class / Department
              </label>
              <input
                id="department"
                type="text"
                name="department"
                className="form-input name-input"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Your Class / Department"
                maxLength={50}
                required
              />
            </div>

            <div className="button-section">
              <button
                className="start-button"
                type="submit"
                disabled={!fullName.trim() || !department.trim() || isLoading}
              >
                {isLoading ? "STARTING..." : "START"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="footer-section">
            <p className="footer-text">World Wide Web Day Challenge © {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className={`loading-overlay ${isLoading ? "show" : ""}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Preparing your challenge...</p>
        </div>
      </div>
    </>
  )
}

export default HomePage
