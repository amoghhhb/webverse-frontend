import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ timeTaken, userData }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Replace with your actual Railway backend URL
  const BACKEND_URL = "https://your-app-name.up.railway.app";

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const playerScore = Math.floor((600 - timeTaken) * 1.5);
  const playerTime = formatTime(timeTaken);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // 1. Save player data
        const saveResponse = await fetch(`${BACKEND_URL}/api/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userData.name,
            department: userData.department,
            timeTaken: timeTaken
          })
        });

        // Handle non-JSON responses
        const saveData = await safeJsonParse(saveResponse);
        if (!saveResponse.ok) {
          throw new Error(saveData?.message || 'Failed to save player data');
        }

        // 2. Fetch leaderboard
        const lbResponse = await fetch(`${BACKEND_URL}/api/leaderboard`);
        const lbData = await safeJsonParse(lbResponse);
        
        if (!lbResponse.ok) {
          throw new Error(lbData?.message || 'Failed to load leaderboard');
        }

        // Process data
        const processedData = Array.isArray(lbData) ? lbData : [];
        const rankedPlayers = processedData.map((player, index) => ({
          ...player,
          rank: index + 1,
          isCurrentPlayer: player.name === userData.name && player.timeTaken === timeTaken,
          timeFormatted: formatTime(player.timeTaken),
          score: Math.floor((600 - player.timeTaken) * 1.5)
        }));

        setLeaderboard(rankedPlayers);
      } catch (err) {
        console.error('Leaderboard error:', err);
        setError(cleanErrorMessage(err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeTaken, userData]);

  // Helper function to safely parse responses
  const safeJsonParse = async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text };
    }
  };

  // Clean error messages containing HTML
  const cleanErrorMessage = (msg) => {
    if (msg.includes('<!DOCTYPE html>')) {
      return 'Server error occurred. Please try again later.';
    }
    return msg;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card loading">
          <h1>🏆 LOADING LEADERBOARD</h1>
          <div className="spinner"></div>
          <p>Calculating rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-card error">
          <h1>⚠️ LEADERBOARD ERROR</h1>
          <div className="error-message">
            <p>{error}</p>
            <div className="player-fallback">
              <h3>Your Results:</h3>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Department:</strong> {userData.department}</p>
              <p><strong>Time:</strong> {playerTime}</p>
              <p><strong>Score:</strong> {playerScore}</p>
            </div>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <h1>🏆 TOP PLAYERS LEADERBOARD</h1>

        <div className="player-summary">
          <h2>Your Performance</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span>Rank</span>
              <strong>
                {leaderboard.find(p => p.isCurrentPlayer)?.rank || '--'}
              </strong>
            </div>
            <div className="summary-item">
              <span>Name</span>
              <strong>{userData.name}</strong>
            </div>
            <div className="summary-item">
              <span>Department</span>
              <strong>{userData.department}</strong>
            </div>
            <div className="summary-item">
              <span>Time</span>
              <strong>{playerTime}</strong>
            </div>
            <div className="summary-item">
              <span>Score</span>
              <strong>{playerScore}</strong>
            </div>
          </div>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="header-cell rank">Rank</div>
            <div className="header-cell name">Player</div>
            <div className="header-cell department">Department</div>
            <div className="header-cell time">Time</div>
            <div className="header-cell score">Score</div>
          </div>

          <div className="table-body">
            {leaderboard.length > 0 ? (
              leaderboard.map(player => (
                <div 
                  key={player._id || player.name} 
                  className={`table-row ${player.isCurrentPlayer ? 'current-player' : ''}`}
                >
                  <div className="cell rank">{player.rank}</div>
                  <div className="cell name">{player.name}</div>
                  <div className="cell department">{player.department || '-'}</div>
                  <div className="cell time">{player.timeFormatted}</div>
                  <div className="cell score">{player.score}</div>
                </div>
              ))
            ) : (
              <div className="no-players">
                No players found. Be the first to complete the challenge!
              </div>
            )}
          </div>
        </div>

        <div className="leaderboard-footer">
          <p>World Wide Web Day Challenge © {new Date().getFullYear()}</p>
          <p className="server-info">
            Connected to: {BACKEND_URL.replace('https://', '')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
