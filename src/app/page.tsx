"use client";

import GameBoard from "@/components/GameBoard";
import Menu from "@/components/Menu";
import GameOver from "@/components/GameOver";
import ScoreDisplay from "@/components/ScoreDisplay";
import FoodAnimation from "@/components/FoodAnimation";
import { useGameLogic } from "@/hooks/useGameLogic";

export default function Home() {
  const { gameState, initGame, resetGame, GRID_SIZE } = useGameLogic();

  return (
    <main className="game-container">
      {gameState.gameStatus === "MENU" && (
        <Menu onSelectDifficulty={initGame} highScore={gameState.highScore} />
      )}

      {gameState.gameStatus === "PLAYING" && (
        <div className="relative game-board-container">
          <GameBoard
            snake={gameState.snake}
            food={gameState.food}
            gridSize={GRID_SIZE}
          />

          <FoodAnimation food={gameState.food} gridSize={GRID_SIZE} />

          {gameState.difficulty && (
            <ScoreDisplay
              score={gameState.score}
              difficulty={gameState.difficulty}
              highScore={gameState.highScore}
            />
          )}
        </div>
      )}

      {gameState.gameStatus === "GAME_OVER" && gameState.difficulty && (
        <GameOver
          score={gameState.score}
          difficulty={gameState.difficulty}
          onRestart={resetGame}
          highScore={gameState.highScore}
        />
      )}
    </main>
  );
}
