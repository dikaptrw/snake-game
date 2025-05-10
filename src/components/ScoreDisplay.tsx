import React, { useMemo } from "react";
import { Difficulty, GameState } from "@/types";

interface ScoreDisplayProps {
  playerName: string;
  score: number;
  difficulty: Difficulty;
  highScore: GameState["highScore"];
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  difficulty,
  highScore,
}) => {
  const isNewHighScore = useMemo(() => {
    return score > highScore[difficulty].value;
  }, [score, highScore, difficulty]);

  return (
    <div className="absolute inset-x-0 top-full mt-3 flex justify-between w-full text-black/75 text-sm sm:text-base">
      <div className="font-bold flex items-end">
        <div>HS:</div>
        <div>{highScore[difficulty].value || 0} </div>
        {highScore[difficulty].playerName && (
          <span className="text-sm">({highScore[difficulty].playerName})</span>
        )}
      </div>
      <div className="font-bold flex items-end">
        <div className="uppercase">Score: </div>
        <div>{score}</div>
        {isNewHighScore && (
          <span className="text-sm animate-pulse uppercase">(New HI)</span>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
