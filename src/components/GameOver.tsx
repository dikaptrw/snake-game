import React from 'react';
import { Difficulty } from '@/types';

interface GameOverProps {
  score: number;
  difficulty: Difficulty;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, difficulty, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-black text-5xl font-bold mb-8">
        GAME
      </div>
      <div className="text-black text-5xl font-bold mb-12">
        OVER!
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="text-black text-2xl font-bold mr-4">
          {difficulty}
        </div>
        <div className="text-black text-2xl font-bold">
          {score}
        </div>
      </div>
      
      <button 
        onClick={onRestart}
        className="text-black text-2xl font-bold hover:scale-110 transition-transform"
      >
        RESTART
      </button>
    </div>
  );
};

export default GameOver;
