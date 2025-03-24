import React, { useEffect, useState } from 'react';
import { Direction } from '@/types';

interface SnakeAnimationProps {
  direction: Direction;
  isGameOver: boolean;
}

const SnakeAnimation: React.FC<SnakeAnimationProps> = ({ direction, isGameOver }) => {
  const [headRotation, setHeadRotation] = useState(0);
  
  // Update head rotation based on direction
  useEffect(() => {
    switch (direction) {
      case 'UP':
        setHeadRotation(270);
        break;
      case 'DOWN':
        setHeadRotation(90);
        break;
      case 'LEFT':
        setHeadRotation(180);
        break;
      case 'RIGHT':
        setHeadRotation(0);
        break;
    }
  }, [direction]);
  
  // Apply shake animation when game over
  const gameOverClass = isGameOver ? 'animate-shake' : '';
  
  return (
    <style jsx global>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
      }
      
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `}</style>
  );
};

export default SnakeAnimation;
