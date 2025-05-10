import React from "react";
import { Difficulty, GameState } from "@/types";
import HighScore from "./HighScore";

interface GameOverProps {
  score: number;
  difficulty: Difficulty;
  onRestart: () => void;
  highScore: GameState["highScore"];
  playerName: GameState["playerName"];
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  difficulty,
  onRestart,
  highScore,
  playerName,
}) => {
  return (
    <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex flex-col items-center justify-center text-black/75 ring-4 ring-black/75">
      <div className="text-3xl sm:text-6xl px-4 font-bold mb-5 sm:mb-8 flex items-center text-center leading-9 sm:leading-18">
        Game Over!
      </div>

      <div className="flex gap-1 items-center flex-col mb-5 sm:mb-8 text-sm 2sm:text-2xl font-bold">
        <div className="flex items-center justify-center">
          <div className="mr-4">{difficulty}</div>
          <div>{score}</div>
        </div>

        {playerName && (
          <div className="font-medium text-base">({playerName})</div>
        )}
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
