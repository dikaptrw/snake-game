// Game types
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameStatus = "MENU" | "PLAYING" | "GAME_OVER";
export type Difficulty = "SLUG" | "WORM" | "PYTHON";

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  gameStatus: GameStatus;
  difficulty: Difficulty | null;
  playerName: string;
  highScore: Record<
    Difficulty,
    {
      value: number;
      playerName: string;
    }
  >;
}
