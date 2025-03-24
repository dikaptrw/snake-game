import React, { useEffect, useState } from 'react';
import { Position } from '@/types';

interface FoodAnimationProps {
  food: Position;
  gridSize: number;
}

const FoodAnimation: React.FC<FoodAnimationProps> = ({ food, gridSize }) => {
  const cellSize = 20;
  
  return (
    <div 
      className="absolute text-black text-2xl font-bold pulse-animation"
      style={{
        left: `${food.x * cellSize}px`,
        top: `${food.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      +
    </div>
  );
};

export default FoodAnimation;
