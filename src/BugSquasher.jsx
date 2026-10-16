import React, { useState, useRef, useCallback } from "react";

const GAME_SECONDS = 20;
const BUG_LIFETIME_START_MS = 1100;
const BUG_LIFETIME_MIN_MS = 450;
const BUGS = ["🐛", "🪲", "🐞"];
const HIGH_SCORE_KEY = "bugSquasherHighScore";

function randomPos() {
  return {
    top: 8 + Math.random() * 74, // percent
    left: 5 + Math.random() * 85, // percent
  };
}

function loadHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

export default function BugSquasher() {
  const [status, setStatus] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [bug, setBug] = useState(null);
  const [squashFx, setSquashFx] = useState(null);
  const [highScore, setHighScore] = useState(loadHighScore);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const spawnTimeoutRef = useRef(null);
  const tickIntervalRef = useRef(null);
  const nextBugIdRef = useRef(0);
  const scoreRef = useRef(0);

  const clearTimers = () => {
    clearTimeout(spawnTimeoutRef.current);
    clearInterval(tickIntervalRef.current);
  };

  // Bugs get faster to react to as the round goes on — rewards skill, raises the ceiling.
  const currentLifetimeMs = () => {
    const elapsed = GAME_SECONDS - timeLeft;
    const ramp = Math.min(1, elapsed / GAME_SECONDS);
    return BUG_LIFETIME_START_MS - ramp * (BUG_LIFETIME_START_MS - BUG_LIFETIME_MIN_MS);
  };

  const spawnBug = useCallback(() => {
    const id = ++nextBugIdRef.current;
    setBug({
      id,
      emoji: BUGS[Math.floor(Math.random() * BUGS.length)],
      ...randomPos(),
    });
    spawnTimeoutRef.current = setTimeout(() => {
      setBug((cur) => (cur && cur.id === id ? null : cur));
      spawnTimeoutRef.current = setTimeout(spawnBug, 250 + Math.random() * 400);
    }, currentLifetimeMs());
  }, [timeLeft]);

  const startGame = () => {
    clearTimers();
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setBug(null);
    setSquashFx(null);
    setIsNewHighScore(false);
    setStatus("playing");

    spawnTimeoutRef.current = setTimeout(spawnBug, 400);
    tickIntervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimers();
          setBug(null);
          setStatus("over");
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            saveHighScore(scoreRef.current);
            setIsNewHighScore(true);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const squash = (e) => {
    if (!bug) return;
    e.preventDefault();
    setSquashFx({ id: bug.id, top: bug.top, left: bug.left });
    setTimeout(() => setSquashFx((f) => (f && f.id === bug.id ? null : f)), 300);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setBug(null);
    clearTimeout(spawnTimeoutRef.current);
    spawnTimeoutRef.current = setTimeout(spawnBug, 200 + Math.random() * 350);
  };

  React.useEffect(() => clearTimers, []);

  return (
    <div className="bug-game">
      <div className="bug-game-hud">
        <span>Score: {score}</span>
        <span>Best: {highScore}</span>
        <span>Time: {timeLeft}s</span>
      </div>
      <div className="bug-game-field">
        {status === "idle" && (
          <div className="bug-game-overlay">
            <p>Squash as many bugs as you can before time runs out! Bugs get faster the longer you survive.</p>
            {highScore > 0 && <p className="bug-game-best">Your best: {highScore}</p>}
            <button className="pixel-btn" onClick={startGame}>Start Game</button>
          </div>
        )}
        {status === "over" && (
          <div className="bug-game-overlay">
            <p>Time's up! You squashed {score} bug{score === 1 ? "" : "s"}.</p>
            {isNewHighScore ? (
              <p className="bug-game-best bug-game-new-best">🏆 New high score!</p>
            ) : (
              <p className="bug-game-best">Best: {highScore}</p>
            )}
            <button className="pixel-btn" onClick={startGame}>Play Again</button>
          </div>
        )}
        {status === "playing" && bug && (
          <button
            key={bug.id}
            className="bug-target"
            style={{ top: `${bug.top}%`, left: `${bug.left}%` }}
            onClick={squash}
            aria-label="Squash bug"
          >
            {bug.emoji}
          </button>
        )}
        {squashFx && (
          <span
            className="bug-squash-fx"
            style={{ top: `${squashFx.top}%`, left: `${squashFx.left}%` }}
          >
            💥
          </span>
        )}
      </div>
    </div>
  );
}
