import { useEffect, useState, useCallback, useRef } from 'react';
import { Direction, GameState, Position, GameStatus, Difficulty } from '@/types';

// Define game constants
const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_DIRECTION: Direction = 'RIGHT';

// Speed in milliseconds for each difficulty level
const SPEED_MAP = {
  SLUG: 200,
  WORM: 150,
  PYTHON: 100
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [],
    food: { x: 0, y: 0 },
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    score: 0,
    gameStatus: 'MENU',
    difficulty: null
  });
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game
  const initGame = useCallback((difficulty: Difficulty) => {
    // Create initial snake in the middle of the board
    const initialSnake: Position[] = [];
    const midPoint = Math.floor(GRID_SIZE / 2);
    
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({
        x: midPoint - i,
        y: midPoint
      });
    }
    
    // Generate initial food position
    const initialFood = generateFood(initialSnake);
    
    // Set initial game state
    setGameState({
      snake: initialSnake,
      food: initialFood,
      direction: INITIAL_DIRECTION,
      nextDirection: INITIAL_DIRECTION,
      score: 0,
      gameStatus: 'PLAYING',
      difficulty
    });
  }, []);

  // Generate food at random position (not on snake)
  const generateFood = (snake: Position[]): Position => {
    let newFood: Position;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      
      foodOnSnake = snake.some(segment => 
        segment.x === newFood.x && segment.y === newFood.y
      );
    }
    
    return newFood!;
  };

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      // Prevent 180-degree turns
      if (
        (prevState.direction === 'UP' && newDirection === 'DOWN') ||
        (prevState.direction === 'DOWN' && newDirection === 'UP') ||
        (prevState.direction === 'LEFT' && newDirection === 'RIGHT') ||
        (prevState.direction === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prevState;
      }
      
      return {
        ...prevState,
        nextDirection: newDirection
      };
    });
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameStatus !== 'PLAYING') {
        return prevState;
      }
      
      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };
      
      // Update direction
      const direction = prevState.nextDirection;
      
      // Move head based on direction
      switch (direction) {
        case 'UP':
          head.y = head.y - 1;
          break;
        case 'DOWN':
          head.y = head.y + 1;
          break;
        case 'LEFT':
          head.x = head.x - 1;
          break;
        case 'RIGHT':
          head.x = head.x + 1;
          break;
      }
      
      // Check for wall collision
      if (
        head.x < 0 || 
        head.x >= GRID_SIZE || 
        head.y < 0 || 
        head.y >= GRID_SIZE
      ) {
        return {
          ...prevState,
          gameStatus: 'GAME_OVER'
        };
      }
      
      // Check for collision with self (excluding the tail which will move)
      // We check against all segments except the last one (which will move)
      const selfCollision = newSnake.slice(0, -1).some(segment => 
        segment.x === head.x && segment.y === head.y
      );
      
      if (selfCollision) {
        return {
          ...prevState,
          gameStatus: 'GAME_OVER'
        };
      }
      
      // Add new head
      newSnake.unshift(head);
      
      // Check for food collision
      let newFood = prevState.food;
      let newScore = prevState.score;
      
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        // Increase score
        newScore += 1;
        
        // Generate new food
        newFood = generateFood(newSnake);
      } else {
        // Remove tail if no food was eaten
        newSnake.pop();
      }
      
      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore
      };
    });
  }, []);

  // Start game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    if (gameState.difficulty) {
      const speed = SPEED_MAP[gameState.difficulty];
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
  }, [gameState.difficulty, moveSnake]);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setGameState({
      snake: [],
      food: { x: 0, y: 0 },
      direction: INITIAL_DIRECTION,
      nextDirection: INITIAL_DIRECTION,
      score: 0,
      gameStatus: 'MENU',
      difficulty: null
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'PLAYING') return;
      
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, gameState.gameStatus]);

  // Start/stop game loop based on game status
  useEffect(() => {
    if (gameState.gameStatus === 'PLAYING') {
      startGameLoop();
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.gameStatus, startGameLoop]);

  return {
    gameState,
    initGame,
    resetGame,
    GRID_SIZE
  };
};
