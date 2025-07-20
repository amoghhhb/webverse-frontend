import React, { useState, useRef, useEffect } from "react";
import "./EmojiRiddle.css";

export default function EmojiRiddle({ onNext, timer, TimerDisplay }) {
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [resultMsg, setResultMsg] = useState("Total: 0");
  const [resultColor, setResultColor] = useState("#fff");
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const submitBtnRef = useRef(null);

  useEffect(() => {
    let timerId = null;
    if (isBlocked && blockTimeLeft > 0) {
      timerId = setTimeout(() => setBlockTimeLeft((prev) => prev - 1), 1000);
    } else if (isBlocked && blockTimeLeft === 0) {
      setIsBlocked(false);
      setResultMsg("⏱️ You can try again now.");
      setResultColor("#fff");
    }
    return () => clearTimeout(timerId);
  }, [isBlocked, blockTimeLeft]);

  const updateResult = () => {
    if (isBlocked || timer === 0) return;

    const answer1 = word1.trim().toLowerCase();
    const answer2 = word2.trim().toLowerCase();
    const answer3 = word3.trim().toLowerCase();

    if (answer1 === "run" && answer2 === "on" && answer3 === "web") {
      setResultMsg("✅ Correct! Total: 8");
      setResultColor("#00ff00");
      setIsNextDisabled(false);
      setWrongAttempts(0);
    } else {
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      setResultMsg(`❌ Incorrect. Total: ${word1.trim().length + word2.trim().length + word3.trim().length}`);
      setResultColor("#ff3333");
      setIsNextDisabled(true);

      if (newAttempts >= 3) {
        const blockDuration = 10 + 5 * (newAttempts - 3);
        setIsBlocked(true);
        setBlockTimeLeft(blockDuration);
        setResultMsg(
          `⏳ Too many wrong attempts. Try again in ${blockDuration} second${blockDuration > 1 ? "s" : ""}.`
        );
        setResultColor("#ff0000ff");
      }
    }
  };

  const handleKey = (e, nextRef) => {
    if (e.key === "Enter" || e.target.value.length === e.target.maxLength) {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  return (
    <div className="emoji-riddle-wrapper">
      {TimerDisplay}
      <h1 className="emoji-riddle-title">
        Emoji Riddle Puzzle 🌐💡
      </h1>
      <div className="emoji-riddle-box">
        <div className="emoji-riddle-instructions">
          Enter the words that match the emojis. Then hit <strong>Submit</strong> to check.<br />
          If the total equals <strong>8</strong> — You're right!
        </div>
        <div className="emoji-riddle-clue">🏃🏻‍♀ + 🔛 + 🕸</div>
        <div className="emoji-riddle-inputs">
          <div className="emoji-riddle-input">
            <input
              type="text"
              maxLength={10}
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              onKeyDown={(e) => handleKey(e, input2Ref)}
              disabled={isBlocked || timer === 0}
              className="emoji-input-field"
            />
            <div className="emoji-letter-hint">
              {word1.trim().length} letters
            </div>
          </div>
          <div className="emoji-plus-symbol">+</div>
          <div className="emoji-riddle-input">
            <input
              ref={input2Ref}
              type="text"
              maxLength={10}
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              onKeyDown={(e) => handleKey(e, input3Ref)}
              disabled={isBlocked || timer === 0}
              className="emoji-input-field"
            />
            <div className="emoji-letter-hint">
              {word2.trim().length} letters
            </div>
          </div>
          <div className="emoji-plus-symbol">+</div>
          <div className="emoji-riddle-input">
            <input
              ref={input3Ref}
              type="text"
              maxLength={10}
              value={word3}
              onChange={(e) => setWord3(e.target.value)}
              onKeyDown={(e) => handleKey(e, submitBtnRef)}
              disabled={isBlocked || timer === 0}
              className="emoji-input-field"
            />
            <div className="emoji-letter-hint">
              {word3.trim().length} letters
            </div>
          </div>
        </div>
        <div className="emoji-result-message" style={{ color: resultColor }}>
          {resultMsg}
        </div>
        <button
          ref={submitBtnRef}
          onClick={updateResult}
          disabled={isBlocked || timer === 0}
          className="emoji-submit-button"
        >
          Submit
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled || timer === 0}
          className="emoji-next-button"
        >
          Go to Next Clue ➡️
        </button>
        {timer === 0 && <p style={{ color: "#e55", fontWeight: "bold" }}>⏰ Time's up!</p>}
      </div>
    </div>
  );
}
