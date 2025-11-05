import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import Controls from './components/Controls.jsx';
import GameBoard from './components/GameBoard.jsx';

const BOARD_SIZE = 20; // 20x20 grid

const DIRS = {
  ArrowUp: { x: 0, y: -1, name: 'UP' },
  ArrowDown: { x: 0, y: 1, name: 'DOWN' },
  ArrowLeft: { x: -1, y: 0, name: 'LEFT' },
  ArrowRight: { x: 1, y: 0, name: 'RIGHT' },
  w: { x: 0, y: -1, name: 'UP' },
  s: { x: 0, y: 1, name: 'DOWN' },
  a: { x: -1, y: 0, name: 'LEFT' },
  d: { x: 1, y: 0, name: 'RIGHT' },
};

function randomFood(size, snake) {
  while (true) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
  }
}

function App() {
  const [snake, setSnake] = useState(() => [
    { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0, name: 'RIGHT' });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0, name: 'RIGHT' });
  const [food, setFood] = useState(() => randomFood(BOARD_SIZE, [{ x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }]));
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(160); // lower is faster
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const v = localStorage.getItem('snake_high_score');
    return v ? Number(v) : 0;
  });

  const intervalRef = useRef(null);
  const boardRef = useRef(null);

  const startPause = useCallback(() => {
    if (gameOver) return;
    setRunning((r) => !r);
  }, [gameOver]);

  const reset = useCallback(() => {
    const start = { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
    const initSnake = [start];
    setSnake(initSnake);
    setDirection({ x: 1, y: 0, name: 'RIGHT' });
    setNextDirection({ x: 1, y: 0, name: 'RIGHT' });
    setFood(randomFood(BOARD_SIZE, initSnake));
    setRunning(false);
    setGameOver(false);
    setScore(0);
    // focus board for immediate key control
    setTimeout(() => {
      boardRef.current?.focus?.();
    }, 0);
  }, []);

  // Handle key presses to update nextDirection
  const handleKey = useCallback((e) => {
    const key = e.key;
    const dir = DIRS[key];
    if (!dir) return;
    e.preventDefault();
    // prevent reversing directly
    const opp = direction.name === 'UP' && dir.name === 'DOWN' ||
      direction.name === 'DOWN' && dir.name === 'UP' ||
      direction.name === 'LEFT' && dir.name === 'RIGHT' ||
      direction.name === 'RIGHT' && dir.name === 'LEFT';
    if (opp && snake.length > 1) return;
    setNextDirection(dir);
  }, [direction, snake.length]);

  useEffect(() => {
    // global listener so controls work even if board not focused
    const onKey = (e) => handleKey(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleKey]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver) return;

    intervalRef.current && clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        // apply buffered turn only once per tick
        setDirection(nextDirection);
        const dir = nextDirection;
        const newHead = {
          x: (head.x + dir.x + BOARD_SIZE) % BOARD_SIZE,
          y: (head.y + dir.y + BOARD_SIZE) % BOARD_SIZE,
        };

        // collision with self
        const hitSelf = prev.some((p) => p.x === newHead.x && p.y === newHead.y);
        if (hitSelf) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const ate = newHead.x === food.x && newHead.y === food.y;
        const nextSnake = [newHead, ...prev];
        if (!ate) nextSnake.pop();
        else {
          setFood(randomFood(BOARD_SIZE, nextSnake));
          setScore((s) => s + 1);
        }
        return nextSnake;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, speed, nextDirection, food, gameOver]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_high_score', String(score));
    }
  }, [score, highScore]);

  useEffect(() => {
    // focus board initially
    setTimeout(() => {
      boardRef.current?.focus?.();
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-slate-800 flex flex-col items-center">
      <Header />

      <Scoreboard score={score} highScore={highScore} gameOver={gameOver} />

      <div className="mt-6" ref={boardRef}>
        <GameBoard
          size={BOARD_SIZE}
          snake={snake}
          food={food}
          gameOver={gameOver}
          onKeyDown={handleKey}
        />
      </div>

      <Controls
        running={running}
        onStartPause={startPause}
        onReset={reset}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <p className="mt-6 text-slate-500 text-xs">Use arrow keys or WASD to steer.</p>
    </div>
  );
}

export default App;
