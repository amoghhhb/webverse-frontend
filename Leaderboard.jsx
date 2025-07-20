import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Replace with your Railway backend URL
  const BACKEND_URL = "webverse-production.up.railway.app";

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Calculate player score locally for display
  const playerScore = Math.floor((600 - timeTaken) * 1.5);
  const playerTime = formatTime(timeTaken);

  useEffect(() => {
    const saveAndFetchData = async () => {
      try {
        // 1. Save player data to backend
        const saveResponse = await fetch(`${BACKEND_URL}/api/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            department: userData.department,
            timeTaken: timeTaken
          })
        });

        const saveResult = await saveResponse.json();
        
        if (!saveResponse.ok) {
          throw new Error(saveResult.error || 'Failed to save player data');
        }

        // 2. Fetch leaderboard data
        const lbResponse = await fetch(`${BACKEND_URL}/api/leaderboard`);
        const lbResult = await lbResponse.json();
        
        if (!lbResponse.ok) {
          throw new Error(lbResult.error || 'Failed to load leaderboard');
        }

        // Mark current player entries
        const updatedLeaderboard = lbResult.data.map(player => ({
          ...player,
          isCurrentPlayer: player.name === userData.name && 
                         player.timeTaken === timeTaken
        }));

        setLeaderboard(updatedLeaderboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    saveAndFetchData();
  }, [timeTaken, userData]);

  // Render loading state
  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card">
          <h1 className="leaderboard-title">🏆 TOP PLAYERS LEADERBOARD</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Updating leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card error-mode">
          <h1 className="leaderboard-title">⚠️ LEADERBOARD ERROR</h1>
          <div className="error-message">
            <p>{error}</p>
            <p>Player: {userData.name}</p>
            <p>Department: {userData.department}</p>
            <p>Your Time: {playerTime}</p>
            <p>Your Score: {playerScore}</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render leaderboard
  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1 className="leaderboard-title">🏆 TOP PLAYERS LEADERBOARD</h1>

        <div className="player-result">
          <div className="result-grid">
            <div className="result-label">Player:</div>
            <div className="result-value">{userData.name}</div>
            
            <div className="result-label">Department:</div>
            <div className="result-value">{userData.department}</div>
            
            <div className="result-label">Completion Time:</div>
            <div className="result-value">{playerTime}</div>
            
            <div className="result-label">Your Score:</div>
            <div className="result-value">{playerScore}</div>
          </div>
        </div>

        <div className="leaderboard-header">
          <div className="leaderboard-rank">Rank</div>
          <div className="leaderboard-name">Player</div>
          <div className="leaderboard-department">Department</div>
          <div className="leaderboard-time">Time</div>
          <div className="leaderboard-score">Score</div>
        </div>

        <div className="leaderboard-list">
          {leaderboard.map(player => (
            <div
              key={player._id}
              className={`leaderboard-player ${player.isCurrentPlayer ? 'current-player' : ''}`}
            >
              <div className="leaderboard-rank">{player.rank}</div>
              <div className="leaderboard-name">{player.name}</div>
              <div className="leaderboard-department">{player.department}</div>
              <div className="leaderboard-time">{formatTime(player.timeTaken)}</div>
              <div className="leaderboard-score">{player.score}</div>
            </div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="no-data-message">
            No players found. Be the first to join the leaderboard!
          </div>
        )}

        <div className="backend-note">
          <p>Leaderboard updates in real-time. Lower time = higher rank</p>
        </div>

        <footer className="leaderboard-footer">
          World Wide Web Day Challenge © 2025
          <div className="server-status">
            Backend: {BACKEND_URL.replace('https://', '')}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Leaderboard;
