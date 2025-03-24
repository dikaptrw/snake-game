import React from "react";
import { Difficulty } from "@/types";
import HighScore from "./HighScore";

interface GameOverProps {
  score: number;
  difficulty: Difficulty;
  onRestart: () => void;
  highScore: Record<Difficulty, number>;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  difficulty,
  onRestart,
  highScore,
}) => {
  return (
    <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex flex-col items-center justify-center text-black/75 ring-4 ring-black/75">
      <div className="text-3xl sm:text-6xl px-4 font-bold mb-6 sm:mb-10 flex items-center text-center leading-9 sm:leading-18">
        Game Over!
      </div>
      <div className="flex items-center justify-center mb-6 sm:mb-10">
        <div className="text-sm 2sm:text-2xl font-bold mr-4">{difficulty}</div>
        <div className="text-sm 2sm:text-2xl font-bold">{score}</div>
      </div>
      <button
        onClick={onRestart}
        className="text-2xs sm:text-xl font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-md bg-black/75 cursor-pointer text-[#9bba5a] transition-transform"
      >
        RESTART
      </button>

      <HighScore highScore={highScore} />
    </div>
  );
};

export default GameOver;
