import React, { useState } from 'react';
import './HomePage.css';

function HomePage({ onNext }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleStart = () => {
    if (!fullName.trim() || !department.trim()) {
      alert('Please enter your full name AND class/department.');
      return;
    }
    
    // Pass user data to onNext callback
    onNext({
      name: fullName.trim(),
      department: department.trim()
    });
  };

  return (
    <div className="game-container">
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
        <div className="menu-line"></div>
      </div>
      {isMenuOpen && (
        <div className="menu-content">
          <p>Enter your full name and class/department and click START to begin the game.</p>
        </div>
      )}
      <div className="game-content">
        <h1 className="welcome-text">WELCOME TO</h1>
        <h1 className="game-text">THE GAME</h1>
        <div className="name-input-container">
          <input
            type="text"
            className="name-input"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your Full Name"
          />
        </div>
        <div className="name-input-container">
          <input
            type="text"
            className="name-input"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            placeholder="Your Class / Department"
          />
        </div>
        <button className="start-button" onClick={handleStart}>
          START
        </button>
      </div>
    </div>
  );
}

export default HomePage;