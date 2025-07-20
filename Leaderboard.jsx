import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeEndpoint, setActiveEndpoint] = useState('');
  
  // Backend configuration
  const BACKEND_CONFIG = {
    production: "https://webverse-production.up.railway.app",
    development: "http://localhost:5000",
    fallback: "https://webverse-production.up.railway.app"
  };

  const getBackendUrl = () => {
    if (import.meta.env?.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
    if (process.env.REACT_APP_API_BASE_URL) return process.env.REACT_APP_API_BASE_URL;
    return process.env.NODE_ENV === 'production' 
      ? BACKEND_CONFIG.production 
      : BACKEND_CONFIG.development;
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const calculateScore = (time) => Math.floor((600 - time) * 1.5);
  const playerScore = calculateScore(timeTaken);
  const playerTime = formatTime(timeTaken);

  // Test if an endpoint is reachable
  const testConnection = async (url) => {
    try {
      const response = await fetch(`${url}/health`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Process and sort leaderboard data
  const processLeaderboardData = (data) => {
    return data
      .map(player => ({
        ...player,
        timeFormatted: formatTime(player.timeTaken),
        score: calculateScore(player.timeTaken),
        isCurrentPlayer: player.name === userData.name
      }))
      .sort((a, b) => a.timeTaken - b.timeTaken)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  };

  // Fetch leaderboard data with endpoint fallback
  const fetchLeaderboardData = async (signal) => {
    const endpoints = [
      getBackendUrl(),
      BACKEND_CONFIG.production,
      BACKEND_CONFIG.fallback
    ].filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        const isAlive = await testConnection(endpoint);
        if (!isAlive) continue;
        
        const response = await fetch(`${endpoint}/api/leaderboard`, { signal });
        if (!response.ok) continue;
        
        const data = await response.json();
        if (Array.isArray(data?.data)) {
          setActiveEndpoint(endpoint);
          return processLeaderboardData(data.data);
        }
      } catch (err) {
        console.error(`Failed with ${endpoint}`, err);
      }
    }
    throw new Error('All endpoints failed');
  };

  // Save player data to the backend
  const savePlayerData = async (signal) => {
    const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    const allScores = [...pendingScores, {
      name: userData.name,
      department: userData.department,
      timeTaken,
      timestamp: Date.now()
    }];

    // Try to send all pending scores
    for (const endpoint of [activeEndpoint, ...Object.values(BACKEND_CONFIG)]) {
      if (!endpoint) continue;
      
      try {
        const success = await Promise.all(
          allScores.map(score => 
            fetch(`${endpoint}/api/players`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(score),
              signal
            }).then(r => r.ok)
          )
        );

        if (success.every(Boolean)) {
          localStorage.removeItem('pendingScores');
          return;
        }
      } catch (err) {
        console.error(`Failed to save with ${endpoint}`, err);
      }
    }

    // If all failed, store locally
    localStorage.setItem('pendingScores', JSON.stringify(allScores));
  };

  // Main data loading effect
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      try {
        await savePlayerData(signal);
        const data = await fetchLeaderboardData(signal);
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        console.error('Data loading error:', err);
        setError({
          message: 'Failed to connect to leaderboard server',
          details: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [timeTaken, userData]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setLeaderboard([]);
    useEffect(() => {
      // Re-trigger the data loading effect
      const controller = new AbortController();
      loadData(controller.signal);
      return () => controller.abort();
    }, []);
  };

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
          {error.details && <span className="error-detail">({error.details})</span>}
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

        <button className="retry-button" onClick={handleRetry}>
          Retry Connection
        </button>

        <div className="connection-info">
          <p>Tried connecting to:</p>
          <ul>
            {[getBackendUrl(), BACKEND_CONFIG.production, BACKEND_CONFIG.fallback]
              .filter(url => url)
              .map((url, i) => (
                <li key={i}>{url}</li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <h1>🏆 Game Leaderboard</h1>
        {activeEndpoint && (
          <p className="connection-status">
            Connected to: {activeEndpoint.replace('https://', '')}
          </p>
        )}
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
        {localStorage.getItem('pendingScores') && (
          <p className="offline-notice">
            Note: Some scores may be pending submission due to connection issues
          </p>
        )}
      </footer>
    </div>
  );
};

Leaderboard.propTypes = {
  timeTaken: PropTypes.number.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    department: PropTypes.string
  }).isRequired
};

export default Leaderboard;
