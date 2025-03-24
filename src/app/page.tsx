"use client";

import React, { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import Menu from '@/components/Menu';
import GameOver from '@/components/GameOver';
import ScoreDisplay from '@/components/ScoreDisplay';
import FoodAnimation from '@/components/FoodAnimation';
import SnakeAnimation from '@/components/SnakeAnimation';
import GameOverAnimation from '@/components/GameOverAnimation';
import { useGameLogic } from '@/hooks/useGameLogic';

export default function Home() {
  const { gameState, initGame, resetGame, GRID_SIZE } = useGameLogic();
  const [showGameOverAnimation, setShowGameOverAnimation] = useState(false);

  // Handle game over animation
  React.useEffect(() => {
    if (gameState.gameStatus === 'GAME_OVER') {
      setShowGameOverAnimation(true);
    }
  }, [gameState.gameStatus]);

  const handleGameOverAnimationComplete = () => {
    setShowGameOverAnimation(false);
  };

  return (
    <main className="game-container">
      {gameState.gameStatus === 'MENU' && (
        <Menu onSelectDifficulty={initGame} />
      )}
      
      {gameState.gameStatus === 'PLAYING' && (
        <div className="game-board-container">
          <GameBoard 
            snake={gameState.snake} 
            food={gameState.food} 
            gridSize={GRID_SIZE} 
          />
          
          <FoodAnimation 
            food={gameState.food}
            gridSize={GRID_SIZE}
          />
          
          {gameState.difficulty && (
            <ScoreDisplay 
              score={gameState.score} 
              difficulty={gameState.difficulty} 
            />
          )}
        </div>
      )}
      
      {gameState.gameStatus === 'GAME_OVER' && !showGameOverAnimation && gameState.difficulty && (
        <GameOver 
          score={gameState.score} 
          difficulty={gameState.difficulty}
          onRestart={resetGame} 
        />
      )}
      
      {showGameOverAnimation && (
        <GameOverAnimation onAnimationComplete={handleGameOverAnimationComplete} />
      )}
      
      <SnakeAnimation 
        direction={gameState.direction}
        isGameOver={gameState.gameStatus === 'GAME_OVER'}
      />
    </main>
  );
}
