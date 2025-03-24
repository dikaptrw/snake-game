import React from 'react';
import { Position } from '@/types';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, gridSize }) => {
  // Calculate cell size based on viewport
  const cellSize = 20;
  const boardSize = gridSize * cellSize;

  return (
    <div 
      className="relative border-4 border-black bg-lime-500"
      style={{ 
        width: `${boardSize}px`, 
        height: `${boardSize}px`,
      }}
    >
      {/* Render food */}
      <div 
        className="absolute text-black text-2xl font-bold"
        style={{
          left: `${food.x * cellSize}px`,
          top: `${food.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        +
      </div>

      {/* Render snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute bg-black"
          style={{
            left: `${segment.x * cellSize}px`,
            top: `${segment.y * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
          }}
        />
      ))}
    </div>
  );
};

export default GameBoard;
