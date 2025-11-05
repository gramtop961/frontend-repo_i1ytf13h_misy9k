import React, { useMemo } from 'react';

function GameBoard({ size, snake, food, gameOver, onKeyDown }) {
  const cells = useMemo(() => {
    const set = new Set(snake.map((p) => `${p.x},${p.y}`));
    return { set };
  }, [snake]);

  const gridTemplate = {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
  };

  return (
    <div
      role="application"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none"
    >
      <div
        className="relative w-[92vw] max-w-[540px] aspect-square bg-emerald-900/20 rounded-xl p-2 shadow-inner"
      >
        <div
          className="grid w-full h-full gap-0.5 bg-emerald-900/10 rounded-lg"
          style={gridTemplate}
        >
          {Array.from({ length: size * size }).map((_, i) => {
            const x = i % size;
            const y = Math.floor(i / size);
            const key = `${x},${y}`;
            const isSnake = cells.set.has(key);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={key}
                className={
                  'rounded-sm transition-colors duration-75 ' +
                  (isSnake
                    ? 'bg-emerald-600'
                    : isFood
                    ? 'bg-rose-500'
                    : 'bg-emerald-200/30')
                }
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-lg">
            <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow">
              <p className="text-slate-800 font-semibold">Game Over — Press Reset</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
