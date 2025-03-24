import React from "react";
import { Difficulty } from "@/types";

interface ScoreDisplayProps {
  score: number;
  difficulty: Difficulty;
  highScore: Record<Difficulty, number>;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  difficulty,
  highScore,
}) => {
  return (
    <div className="absolute inset-x-0 top-full mt-3 flex justify-between w-full text-black/75 text-xl">
      <div className="font-bold">HS:{highScore[difficulty]}</div>
      <div className="flex items-center">
        <div className="font-bold mr-2">{difficulty}</div>
        <div className="font-bold">{score}</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
