import React from "react";
import { Difficulty } from "@/types";

interface GameOverProps {
  score: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  difficulty,
  onRestart,
}) => {
  return (
    <div className="w-[500px] h-[500px] flex flex-col items-center justify-center text-black/75 ring-4 ring-black/75">
      <div className="text-6xl font-bold mb-10 flex items-center text-center leading-18">
        Game Over!
      </div>
      <div className="flex items-center justify-center mb-10">
        <div className="text-2xl font-bold mr-4">{difficulty}</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      <button
        onClick={onRestart}
        className="text-xl font-bold px-4 py-3 rounded-md bg-black/75 cursor-pointer text-[#9bba5a] transition-transform"
      >
        RESTART
      </button>
      =
    </div>
  );
};

export default GameOver;
