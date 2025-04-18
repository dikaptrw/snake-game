"use client";

import GameBoard from "@/components/GameBoard";
import Menu from "@/components/Menu";
import GameOver from "@/components/GameOver";
import ScoreDisplay from "@/components/ScoreDisplay";
import FoodAnimation from "@/components/FoodAnimation";
import { useGameLogic } from "@/hooks/useGameLogic";

export default function Home() {
  const { gameState, initGame, resetGame, gridSize } = useGameLogic();

  return (
    <main className="game-container">
      {gameState.gameStatus === "MENU" && (
        <Menu onSelectDifficulty={initGame} highScore={gameState.highScore} />
      )}

      {gameState.gameStatus === "PLAYING" && (
        <div className="relative game-board-container">
          <h1 className="absolute inset-x-0 text-center bottom-full mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-wider">
            snake
          </h1>

          <GameBoard
            snake={gameState.snake}
            food={gameState.food}
            gridSize={gridSize}
            direction={gameState.direction}
          />

          <FoodAnimation food={gameState.food} gridSize={gridSize} />

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
