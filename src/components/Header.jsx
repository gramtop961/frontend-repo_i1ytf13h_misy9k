import React from 'react';

function Header() {
  return (
    <header className="w-full py-6 flex items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-emerald-600">
        Snake
        <span className="text-slate-800 ml-2">Game</span>
      </h1>
    </header>
  );
}

export default Header;
