import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dynamic backend URL based on environment
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 
    (process.env.NODE_ENV === 'production'
      ? 'webverse-production.up.railway.app'
      : 'http://localhost:5000');

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

    const fetchLeaderboardData = async () => {
      try {
        // 1. Save player data (with retry logic)
        const saveResponse = await fetchWithRetry(
          `${BACKEND_URL}/api/players`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: userData.name,
              department: userData.department,
              timeTaken: timeTaken
            }),
            signal
          }
        );

        // 2. Fetch leaderboard data
        const lbResponse = await fetchWithRetry(
          `${BACKEND_URL}/api/leaderboard`,
          { signal }
        );

        const processedData = Array.isArray(lbResponse.data) ? lbResponse.data : [];
        const rankedPlayers = processedData.map((player, index) => ({
          ...player,
          rank: index + 1,
          isCurrentPlayer: player.name === userData.name && player.timeTaken === timeTaken,
          timeFormatted: formatTime(player.timeTaken),
          score: calculateScore(player.timeTaken)
        }));

        setLeaderboard(rankedPlayers);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setError(formatErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchWithRetry = async (url, options, retries = 3) => {
      try {
        const response = await fetch(url, options);
        const data = await safeJsonParse(response);
        
        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}`);
        }
        
        return data;
      } catch (err) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchWithRetry(url, options, retries - 1);
        }
        throw err;
      }
    };

    const safeJsonParse = async (response) => {
      const text = await response.text();
      try {
        return text ? JSON.parse(text) : {};
      } catch {
        return { message: text };
      }
    };

    const formatErrorMessage = (err) => {
      if (err.message.includes('Failed to fetch')) {
        return 'Cannot connect to the server. Showing local results only.';
      }
      return err.message.includes('<!DOCTYPE html>')
        ? 'Server error occurred. Please try again later.'
        : err.message;
    };

    fetchLeaderboardData();

    return () => controller.abort();
  }, [timeTaken, userData]);

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-error">
        <div className="error-card">
          <h2>⚠️ Connection Error</h2>
          <p className="error-message">{error}</p>
          
          <div className="player-fallback">
            <h3>Your Results</h3>
            <div className="fallback-grid">
              <div>
                <span>Name:</span>
                <strong>{userData.name}</strong>
              </div>
              <div>
                <span>Department:</span>
                <strong>{userData.department}</strong>
              </div>
              <div>
                <span>Time:</span>
                <strong>{playerTime}</strong>
              </div>
              <div>
                <span>Score:</span>
                <strong>{playerScore}</strong>
              </div>
            </div>
          </div>

          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Refresh Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p className="server-status">
          {BACKEND_URL.includes('localhost') 
            ? 'Using development server' 
            : `Connected to: ${BACKEND_URL.replace('https://', '')}`}
        </p>
      </div>

      <div className="player-summary-card">
        <h2>Your Performance</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <span>Rank</span>
            <strong>
              {leaderboard.find(p => p.isCurrentPlayer)?.rank || '--'}
            </strong>
          </div>
          <div className="summary-item">
            <span>Score</span>
            <strong>{playerScore}</strong>
          </div>
          <div className="summary-item">
            <span>Time</span>
            <strong>{playerTime}</strong>
          </div>
        </div>
      </div>

      <div className="leaderboard-table-container">
        <div className="table-scroll-wrapper">
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
                    className={player.isCurrentPlayer ? 'current-player' : ''}
                  >
                    <td>{player.rank}</td>
                    <td>{player.name}</td>
                    <td>{player.department || '-'}</td>
                    <td>{player.timeFormatted}</td>
                    <td>{player.score}</td>
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="5">No players found yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="leaderboard-footer">
        <p>World Wide Web Day Challenge © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Leaderboard;
