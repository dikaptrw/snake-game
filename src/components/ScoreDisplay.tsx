import React from 'react';
import { Difficulty } from '@/types';

interface ScoreDisplayProps {
  score: number;
  difficulty: Difficulty;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, difficulty }) => {
  return (
    <div className="flex justify-between w-full mt-2">
      <div className="text-black text-2xl font-bold">
        0
      </div>
      <div className="flex items-center">
        <div className="text-black text-2xl font-bold mr-2">
          {difficulty}
        </div>
        <div className="text-black text-2xl font-bold">
          {score}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
