import React, { useState, useEffect, useRef } from 'react';
import './SecureAccess.css';

const SecureAccess = ({ timer, TimerDisplay, onNext }) => {
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'success', 'fail'
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle timer expiration
  useEffect(() => {
    if (timer === 0 && status === 'idle') {
      setStatus('timeout');
    }
  }, [timer, status]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 6 characters
    if (/^\d{0,6}$/.test(value)) {
      setPasscode(value);
      
      if (status !== 'idle') {
        setStatus('idle');
      }
    }
  };

  const handleSubmit = () => {
    if (passcode.length === 6 && timer > 0) {
      checkCode(passcode);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && passcode.length === 6 && timer > 0) {
      checkCode(passcode);
    }
  };

  const checkCode = (entered) => {
    if (entered === "182025") {
      setStatus('success');
      // Automatically proceed to leaderboard after a short delay
      setTimeout(() => {
        onNext();
      }, 1500);
    } else {
      setStatus('fail');
      setPasscode(''); // Clear passcode on failure
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="secure-container">
      {TimerDisplay}
      
      <div className="secure-card">
        <h1 className="secure-title">🔐 SECURE ACCESS PORTAL</h1>
        <p className="secure-subtitle">Enter the 6-digit passcode to unlock the leaderboard</p>
        
        <div className="secure-input-container">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={passcode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="secure-input"
            placeholder="Enter passcode"
            disabled={timer === 0 || status === 'success'}
          />
          <button
            className="secure-submit-button"
            onClick={handleSubmit}
            disabled={passcode.length !== 6 || timer === 0}
          >
            Submit
          </button>
        </div>

        {status === 'success' && (
          <div className="secure-result feedback-success">
            ✅ Access Granted! Redirecting to leaderboard...
          </div>
        )}
        
        {status === 'fail' && (
          <div className="secure-result feedback-error">
            ❌ Access Denied: Invalid Passcode!
          </div>
        )}
        
        {status === 'timeout' && (
          <div className="secure-result feedback-error">
            ⏰ Time's up! Challenge expired
          </div>
        )}

        <footer className="secure-footer">World Wide Web Day Access Challenge © 2025</footer>
      </div>
    </div>
  );
};

export default SecureAccess;