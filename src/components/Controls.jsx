import React from 'react';

function Controls({ running, onStartPause, onReset, speed, onSpeedChange }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onStartPause}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold shadow hover:bg-slate-900 transition"
        >
          Reset
        </button>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-slate-600 font-medium">Speed</label>
        <input
          type="range"
          min="80"
          max="300"
          step="10"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-40 accent-emerald-600"
        />
        <span className="text-slate-500 text-sm">{Math.round(400 - speed)}%</span>
      </div>
    </div>
  );
}

export default Controls;
