"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import "./Leaderboard.css"

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)

  const BACKEND_URL = "https://webverse-production.up.railway.app"

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0")
    const secs = String(seconds % 60).padStart(2, "0")
    return `${mins}:${secs}`
  }

  // Calculate score (higher is better)
  const calculateScore = (time) => Math.floor((600 - time) * 1.5)
  const playerScore = calculateScore(timeTaken)
  const playerTime = formatTime(timeTaken)

  // Save score to localStorage when offline
  const saveScoreLocally = () => {
    const pendingScores = JSON.parse(localStorage.getItem("pendingScores") || "[]")
    pendingScores.push({
      name: userData.name,
      department: userData.department,
      timeTaken,
      score: playerScore,
      timestamp: Date.now(),
    })
    localStorage.setItem("pendingScores", JSON.stringify(pendingScores))
  }

  // Submit score to server
  const submitScoreToServer = async (signal) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          department: userData.department,
          timeTaken,
          score: playerScore,
        }),
        signal,
      })

      if (!response.ok) throw new Error("Server rejected submission")
      return true
    } catch (err) {
      console.error("Score submission failed:", err)
      return false
    }
  }

  // Fetch leaderboard data
  const fetchLeaderboard = async (signal) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leaderboard`, { signal })
      if (!response.ok) throw new Error("Failed to fetch leaderboard")

      const data = await response.json()
      if (!Array.isArray(data?.data)) throw new Error("Invalid data format")

      return data.data.map((player, index) => ({
        ...player,
        rank: index + 1,
        timeFormatted: formatTime(player.timeTaken),
        isCurrentPlayer: player.name === userData.name,
        score: calculateScore(player.timeTaken),
      }))
    } catch (err) {
      console.error("Leaderboard fetch error:", err)
      throw err
    }
  }

  // Submit any pending scores from localStorage
  const submitPendingScores = async (signal) => {
    const pendingScores = JSON.parse(localStorage.getItem("pendingScores") || "[]")
    if (pendingScores.length === 0) return

    try {
      const successfulSubmissions = []

      for (const score of pendingScores) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/players`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(score),
            signal,
          })

          if (response.ok) {
            successfulSubmissions.push(score.timestamp)
          }
        } catch (err) {
          console.error("Failed to submit pending score:", err)
        }
      }

      // Remove successfully submitted scores
      if (successfulSubmissions.length > 0) {
        const remainingScores = pendingScores.filter((score) => !successfulSubmissions.includes(score.timestamp))
        localStorage.setItem("pendingScores", JSON.stringify(remainingScores))
      }
    } catch (err) {
      console.error("Pending scores submission error:", err)
    }
  }

  // Main data loading effect
  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const loadData = async () => {
      try {
        setLoading(true)
        setOfflineMode(false)

        // First try to submit any pending scores
        await submitPendingScores(signal)

        // Then submit current score
        const submitted = await submitScoreToServer(signal)
        if (!submitted) {
          saveScoreLocally()
          setOfflineMode(true)
        }

        // Finally fetch leaderboard
        const data = await fetchLeaderboard(signal)
        setLeaderboard(data)
        setError(null)
      } catch (err) {
        console.error("Data loading error:", err)
        saveScoreLocally()
        setOfflineMode(true)
        setError({
          message: "Connection issues detected",
          details: "Using offline mode. Scores will sync when connection is restored.",
        })
      } finally {
        setLoading(false)
      }
    }

    // Check online status first
    if (navigator.onLine) {
      loadData()
    } else {
      setOfflineMode(true)
      setError({
        message: "You are currently offline",
        details: "Scores will be submitted when connection is restored",
      })
      setLoading(false)
    }

    return () => controller.abort()
  }, [timeTaken, userData])

  const handleRetry = () => {
    if (!navigator.onLine) {
      setError({
        message: "Still offline",
        details: "Please check your internet connection",
      })
      return
    }
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading leaderboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        {error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">{error.message}</h2>
            <p className="error-detail">{error.details}</p>

            <div className="player-results">
              <h3>Your Game Results</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Name:</span>
                  <strong className="result-value">{userData.name}</strong>
                </div>
                <div className="result-item">
                  <span className="result-label">Department:</span>
                  <strong className="result-value">{userData.department}</strong>
                </div>
                <div className="result-item">
                  <span className="result-label">Time:</span>
                  <strong className="result-value">{playerTime}</strong>
                </div>
                <div className="result-item">
                  <span className="result-label">Score:</span>
                  <strong className="result-value">{playerScore}</strong>
                </div>
              </div>
            </div>

            <button className="retry-button" onClick={handleRetry} disabled={!navigator.onLine}>
              {navigator.onLine ? "Retry Connection" : "Offline Mode"}
            </button>

            <div className="connection-info">
              <p>Server endpoint:</p>
              <code className="endpoint-url">{BACKEND_URL}</code>
            </div>
          </div>
        ) : (
          <>
            <header className="leaderboard-header">
              <h1 className="leaderboard-title">🏆 Game Leaderboard</h1>
              {offlineMode && (
                <div className="offline-notice">
                  <span className="offline-indicator"></span>
                  Note: Showing cached data. Scores will sync when back online.
                </div>
              )}
            </header>

            <section className="player-summary">
              <h2 className="section-title">Your Performance</h2>
              <div className="summary-cards">
                <div className="summary-card rank-card">
                  <div className="card-icon">🏅</div>
                  <span className="card-label">Rank</span>
                  <span className="card-value">{leaderboard.find((p) => p.isCurrentPlayer)?.rank || "--"}</span>
                </div>
                <div className="summary-card score-card">
                  <div className="card-icon">⭐</div>
                  <span className="card-label">Score</span>
                  <span className="card-value">{playerScore}</span>
                </div>
                <div className="summary-card time-card">
                  <div className="card-icon">⏱️</div>
                  <span className="card-label">Time</span>
                  <span className="card-value">{playerTime}</span>
                </div>
              </div>
            </section>

            <section className="leaderboard-section">
              <h2 className="section-title">Top Players</h2>
              <div className="table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Department</th>
                      <th>Time</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length > 0 ? (
                      leaderboard.map((player, index) => (
                        <tr
                          key={player._id || `${player.name}-${player.rank}`}
                          className={`table-row ${player.isCurrentPlayer ? "highlighted-row" : ""} ${index < 3 ? `top-${index + 1}` : ""}`}
                        >
                          <td className="rank-cell">
                            {index < 3 ? (
                              <span className={`medal medal-${index + 1}`}>
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </span>
                            ) : (
                              player.rank
                            )}
                          </td>
                          <td className="name-cell">{player.name}</td>
                          <td className="department-cell">{player.department || "-"}</td>
                          <td className="time-cell">{player.timeFormatted}</td>
                          <td className="score-cell">{player.score}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="empty-row">
                        <td colSpan="5">No leaderboard data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        <footer className="leaderboard-footer">
          <p>World Wide Web Day Challenge © {new Date().getFullYear()}</p>
          {localStorage.getItem("pendingScores") && (
            <div className="sync-notice">
              <span className="sync-icon">🔄</span>
              You have {JSON.parse(localStorage.getItem("pendingScores")).length} scores waiting to sync
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}

Leaderboard.propTypes = {
  timeTaken: PropTypes.number.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    department: PropTypes.string,
  }).isRequired,
}

export default Leaderboard
