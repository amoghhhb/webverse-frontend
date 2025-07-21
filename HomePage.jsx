import React, { useState } from 'react';
import './HomePage.css';

function HomePage({ onNext }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleStart = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !department.trim()) {
      alert('Please enter your full name AND class/department.');
      return;
    }

    try {
      // 🔥 Send to /submit
      const res = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName.trim(),
          department: department.trim()
        }),
      });

      const data = await res.json();
      // console.log('Server response:', data);

      // Proceed to the next step
      onNext({
        name: fullName.trim(),
        department: department.trim()
      });

    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
        <form onSubmit={handleStart}>
          <div className="name-input-container">
            <input
              type="text"
              name="fullname"
              className="name-input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your Full Name"
            />
          </div>
          <div className="name-input-container">
            <input
              type="text"
              name="department"
              className="name-input"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="Your Class / Department"
            />
          </div>
          <button className="start-button" type="submit">
            START
          </button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;