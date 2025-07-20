import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Updated backend configuration
  const BACKEND_CONFIG = {
    production: "https://webverse-backend-production.up.railway.app",
    development: "http://localhost:5000",
    fallback: "https://webverse-game-backend-production.up.railway.app"
  };

  const getBackendUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    return process.env.NODE_ENV === 'production' 
      ? BACKEND_CONFIG.production 
      : BACKEND_CONFIG.development;
  };

  const BACKEND_URL = getBackendUrl();

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const calculateScore = (time) => Math.floor((600 - time) * 1.5);
  const playerScore = calculateScore(timeTaken);
  const playerTime = formatTime(timeTaken);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        // Try multiple endpoints if needed
        const endpointsToTry = [
          `${BACKEND_URL}/api/leaderboard`,
          `${BACKEND_CONFIG.fallback}/api/leaderboard`
        ];

        let leaderboardData = [];
        let lastError = null;

        for (const endpoint of endpointsToTry) {
          try {
            const response = await fetch(endpoint, { signal });
            if (!response.ok) continue;
            
            const data = await response.json();
            if (Array.isArray(data?.data)) {
              leaderboardData = data.data;
              break;
            }
          } catch (err) {
            lastError = err;
            continue;
          }
        }

        if (leaderboardData.length === 0 && lastError) {
          throw lastError;
        }

        // Process data
        const rankedPlayers = leaderboardData.map((player, index) => ({
          ...player,
          rank: index + 1,
          isCurrentPlayer: player.name === userData.name,
          timeFormatted: formatTime(player.timeTaken),
          score: calculateScore(player.timeTaken)
        }));

        setLeaderboard(rankedPlayers);
        setError(null);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError({
          message: 'Failed to connect to leaderboard server',
          details: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    // First save player data, then fetch leaderboard
    const saveAndFetch = async () => {
      try {
        // Try to save player data (but proceed even if it fails)
        await fetch(`${BACKEND_URL}/api/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            department: userData.department,
            timeTaken: timeTaken
          }),
          signal
        }).catch(() => {}); // Silently fail if save doesn't work
        
        await fetchData();
      } catch (err) {
        console.error('Save and fetch error:', err);
      }
    };

    saveAndFetch();

    return () => controller.abort();
  }, [timeTaken, userData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading leaderboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Connection Error</h2>
        <p className="error-message">
          {error.message}
          {error.details && (
            <span className="error-detail">({error.details})</span>
          )}
        </p>
        
        <div className="player-results">
          <h3>Your Game Results</h3>
          <div className="result-grid">
            <div className="result-item">
              <span>Name:</span>
              <strong>{userData.name}</strong>
            </div>
            <div className="result-item">
              <span>Department:</span>
              <strong>{userData.department}</strong>
            </div>
            <div className="result-item">
              <span>Time:</span>
              <strong>{playerTime}</strong>
            </div>
            <div className="result-item">
              <span>Score:</span>
              <strong>{playerScore}</strong>
            </div>
          </div>
        </div>

        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry Connection
        </button>

        <div className="connection-info">
          <p>Tried connecting to:</p>
          <ul>
            <li>{BACKEND_URL}</li>
            <li>{BACKEND_CONFIG.fallback}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <h1>🏆 Game Leaderboard</h1>
        <p className="connection-status">
          Connected to: {BACKEND_URL.replace('https://', '')}
        </p>
      </header>

      <section className="player-summary">
        <h2>Your Performance</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="card-label">Rank</span>
            <span className="card-value">
              {leaderboard.find(p => p.isCurrentPlayer)?.rank || '--'}
            </span>
          </div>
          <div className="summary-card">
            <span className="card-label">Score</span>
            <span className="card-value">{playerScore}</span>
          </div>
          <div className="summary-card">
            <span className="card-label">Time</span>
            <span className="card-value">{playerTime}</span>
          </div>
        </div>
      </section>

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
              leaderboard.map(player => (
                <tr 
                  key={player._id || `${player.name}-${player.timeTaken}`}
                  className={player.isCurrentPlayer ? 'highlighted-row' : ''}
                >
                  <td>{player.rank}</td>
                  <td>{player.name}</td>
                  <td>{player.department || '-'}</td>
                  <td>{player.timeFormatted}</td>
                  <td>{player.score}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="5">No players found yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="leaderboard-footer">
        <p>World Wide Web Day Challenge © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Leaderboard;
