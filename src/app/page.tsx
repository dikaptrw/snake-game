"use client";

import GameBoard from "@/components/GameBoard";
import Menu from "@/components/Menu";
import GameOver from "@/components/GameOver";
import ScoreDisplay from "@/components/ScoreDisplay";
import { useGameLogic } from "@/hooks/useGameLogic";

export default function Home() {
  const { gameState, initGame, resetGame, gridSize, setPlayerName } =
    useGameLogic();

  return (
    <main className="game-container">
      {gameState.gameStatus === "MENU" && (
        <Menu
          onSelectDifficulty={initGame}
          highScore={gameState.highScore}
          playerName={gameState.playerName}
          setPlayerName={setPlayerName}
        />
      )}

      {gameState.gameStatus === "PLAYING" && (
        <div className="relative game-board-container">
          <div className="absolute top-0 inset-x-0 -translate-y-full">
            <div className="flex w-full justify-between mb-3">
              <div className="flex items-center gap-1 font-bold">
                <div className="uppercase">Player:</div>
                <div>{gameState.playerName}</div>
              </div>

              <div className="font-bold">D:{gameState.difficulty}</div>
            </div>
          </div>

          <GameBoard
            snake={gameState.snake}
            food={gameState.food}
            gridSize={gridSize}
            direction={gameState.direction}
          />

          {gameState.difficulty && (
            <ScoreDisplay
              score={gameState.score}
              difficulty={gameState.difficulty}
              highScore={gameState.highScore}
              playerName={gameState.playerName}
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
          playerName={gameState.playerName}
        />
      )}
    </main>
  );
}
