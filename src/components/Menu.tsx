import React from 'react';
import { Difficulty } from '@/types';

interface MenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const Menu: React.FC<MenuProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-black text-5xl font-bold mb-8 flex items-center">
        <span className="mr-2">+</span>
        <span className="tracking-wider">snake</span>
        <span className="ml-2">+</span>
      </div>
      
      <div className="text-black text-2xl font-bold mb-8">
        CHOOSE LEVEL:
      </div>
      
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => onSelectDifficulty('SLUG')}
          className="text-black text-3xl font-bold hover:scale-110 transition-transform"
        >
          SLUG
        </button>
        <button 
          onClick={() => onSelectDifficulty('WORM')}
          className="text-black text-3xl font-bold hover:scale-110 transition-transform"
        >
          WORM
        </button>
        <button 
          onClick={() => onSelectDifficulty('PYTHON')}
          className="text-black text-3xl font-bold hover:scale-110 transition-transform"
        >
          PYTHON
        </button>
      </div>
    </div>
  );
};

export default Menu;
