import React from "react";
import { Direction, Position } from "@/types";

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  direction: Direction;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  gridSize,
  direction,
}) => {
  // Calculate cell size based on viewport
  const cellSize = 20;
  const boardSize = gridSize * cellSize;

  const handleHeadWormClass = () => {
    if (direction === "UP")
      return "after:top-1 after:left-1 before:top-1 before:right-1";
    if (direction === "DOWN")
      return "after:bottom-1 after:right-1 before:bottom-1 before:left-1";
    if (direction === "LEFT")
      return "after:top-1 after:left-1 before:bottom-1 before:left-1";
    if (direction === "RIGHT")
      return "after:top-1 after:right-1 before:bottom-1 before:right-1";
  };

  return (
    <div
      className="relative ring-4 ring-black/75 overflow-hidden"
      style={{
        width: `${boardSize}px`,
        height: `${boardSize}px`,
      }}
    >
      {/* Render food */}
      <div
        className="absolute text-[#262E17] text-2xl font-bold select-none"
        style={{
          left: `${food.x * cellSize}px`,
          top: `${food.y * cellSize}px`,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        +
      </div>

      {/* Render snake */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className={[
            "absolute bg-[#262E17] select-none",
            index === 0 &&
              `after:absolute after:bg-[#9bba5a] after:w-1 after:h-1
            before:absolute before:bg-[#9bba5a] before:w-1 before:h-1`,
            index === 0 && handleHeadWormClass(),
          ].join(" ")}
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
