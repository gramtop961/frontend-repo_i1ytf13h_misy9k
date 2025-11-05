import React from 'react';

function Scoreboard({ score, highScore, gameOver }) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm md:text-base">
      <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold shadow-sm">
        Score: <span className="font-bold">{score}</span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-semibold shadow-sm">
        Best: <span className="font-bold">{highScore}</span>
      </div>
      {gameOver && (
        <span className="text-rose-600 font-semibold">Game Over</span>
      )}
    </div>
  );
}

export default Scoreboard;
