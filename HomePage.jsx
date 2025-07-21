"use client"

import { useState } from "react"
import "./homepage.css"

const HomePage = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState("")
  const [department, setDepartment] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartGame = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name")
      return
    }

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      onStartGame({
        name: playerName.trim(),
        department: department.trim() || "General",
      })
      setIsLoading(false)
    }, 1500)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
            <strong>Objective:</strong> Test your web development knowledge and speed
          </div>
          <div className="menu-item">
            <strong>Time Limit:</strong> Complete challenges as quickly as possible
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
            <h1 className="welcome-text">Welcome to</h1>
            <h2 className="game-text">Web Challenge</h2>
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
          <div className="form-section">
            <div className="input-group name-input-container">
              <label htmlFor="playerName" className="input-label">
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={30}
                required
              />
            </div>

            <div className="input-group class-input-container">
              <label htmlFor="department" className="input-label">
                Department (Optional)
              </label>
              <input
                id="department"
                type="text"
                className="form-input"
                placeholder="e.g., Computer Science, Marketing"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                maxLength={50}
              />
            </div>
          </div>

          {/* Button Section */}
          <div className="button-section">
            <button className="start-button" onClick={handleStartGame} disabled={!playerName.trim() || isLoading}>
              {isLoading ? "Starting Game..." : "Start Challenge"}
            </button>
          </div>

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
