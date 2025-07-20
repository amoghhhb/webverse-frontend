import React, { useState, useRef, useEffect } from "react";
import HomePage from "./HomePage";
import GamePage from "./GamePage";
import EmojiRiddle from "./EmojiRiddle";
import InspectPage from "./InspectPage";
import CaesarCipherQuiz from "./CaesarCipherQuiz";
import Ascii from "./Ascii";
import ExtensionPuzzle from "./ExtensionPuzzle";
import SecureAccess from "./SecureAccess";
import Leaderboard from "./Leaderboard";

function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

function TimerDisplay({ seconds }) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return (
    <div
      style={{
        position: "fixed",
        left: 25,
        top: 10,
        zIndex: 2000,
        fontFamily: "'Orbitron', 'Oswald', 'Arial Black', Arial, sans-serif",
        fontWeight: 900,
        fontSize: "1.6rem",
        color: "#fff",
        letterSpacing: "2px",
        textShadow: `
          0 0 2px #fff,
          0 0 4px #fff
        `,
      }}
    >
      ⏳ {min}:{sec}
    </div>
  );
}

const PAGE_ORDER = [
  "home",
  "game",
  "emoji",
  "inspect",
  "caesar",
  "ascii",
  "extension",
  "secure",
  "leaderboard"
];

function App() {
  const [page, setPage] = useState("home");
  const [timer, setTimer] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [userData, setUserData] = useState({ name: "", department: "" });
  const timerRef = useRef(null);

  const showTimer = PAGE_ORDER.indexOf(page) >= PAGE_ORDER.indexOf("game") &&
                    PAGE_ORDER.indexOf(page) <= PAGE_ORDER.indexOf("secure");

  // Timer interval management
  useEffect(() => {
    if (timerActive && showTimer && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, showTimer]);

  // Handle timer expiration
  useEffect(() => {
    if (timer === 0 && timerActive) {
      setTimerActive(false);
    }
  }, [timer, timerActive]);

  const handleStartGame = (user) => {
    setUserData(user);
    setTimer(600);
    setTimerActive(true);
    setPage("game");
  };

  const handleCompleteSecureAccess = () => {
    setTimeTaken(600 - timer); // Calculate actual time taken
    setTimerActive(false);
    setPage("leaderboard");
  };

  const sharedProps = {
    timer,
    TimerDisplay: showTimer ? <TimerDisplay seconds={timer} /> : null
  };

  let pageComponent = null;
  switch (page) {
    case "home":
      pageComponent = <HomePage onNext={handleStartGame} />;
      break;
    case "game":
      pageComponent = <GamePage {...sharedProps} onNext={() => setPage("emoji")} />;
      break;
    case "emoji":
      pageComponent = <EmojiRiddle {...sharedProps} onNext={() => setPage("inspect")} />;
      break;
    case "inspect":
      pageComponent = <InspectPage {...sharedProps} onNext={() => setPage("caesar")} />;
      break;
    case "caesar":
      pageComponent = <CaesarCipherQuiz {...sharedProps} onNext={() => setPage("ascii")} />;
      break;
    case "ascii":
      pageComponent = <Ascii {...sharedProps} onNext={() => setPage("extension")} />;
      break;
    case "extension":
      pageComponent = <ExtensionPuzzle {...sharedProps} onNext={() => setPage("secure")} />;
      break;
    case "secure":
      pageComponent = <SecureAccess {...sharedProps} onNext={handleCompleteSecureAccess} />;
      break;
    case "leaderboard":
      pageComponent = <Leaderboard timeTaken={timeTaken} userData={userData} />;
      break;
    default:
      pageComponent = <div>404 Not Found</div>;
  }

  return <>{pageComponent}</>;
}

export default App;