import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Direction, GameState, Position, Difficulty } from "@/types";
import useDevice from "./useDevice";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import db from "@/utils/firestore";
import { ENV } from "@/constants";
import { DEFAULT_PLAYER_NAME } from "@/components/GamePlayer";

// Define game constants
const INITIAL_SNAKE_LENGTH = 3;
const INITIAL_DIRECTION: Direction = "RIGHT";
const HIGH_SCORE_STORAGE_KEY = "snakeHighScore";

// Minimum swipe distance (in pixels) to register as a swipe
const MIN_SWIPE_DISTANCE = 30;

// Speed in milliseconds for each difficulty level
const SPEED_MAP = {
  SLUG: 200,
  WORM: 150,
  PYTHON: 100,
};

export const useGameLogic = () => {
  const { isMobile } = useDevice();
  const gridSize = useMemo(() => (isMobile ? 15 : 25), [isMobile]);
  const [gameState, setGameState] = useState<GameState>({
    snake: [],
    food: { x: 0, y: 0 },
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    score: 0,
    gameStatus: "MENU",
    difficulty: null,
    playerName: "",
    highScore: {
      SLUG: {
        value: 0,
        playerName: "",
      },
      WORM: {
        value: 0,
        playerName: "",
      },
      PYTHON: {
        value: 0,
        playerName: "",
      },
    },
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const collectionRef = useMemo(() => {
    return collection(db, "dikaptrw-profile", ENV, "games");
  }, []);
  const docRef = useMemo(() => {
    return doc(collectionRef, process.env.NEXT_PUBLIC_SNAKE_GAME_DOC_ID);
  }, [collectionRef]);

  // Handle first render for high score
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HIGH_SCORE_MODE === "firestore") {
      getDoc(docRef).then((res) => {
        const data = res.data();

        if (data) {
          setGameState((prev) => ({
            ...prev,
            highScore: data.highScore,
          }));
        }
      });

      // Listen for changes in the Firestore document
      const unsubscribe = onSnapshot(docRef, (data) => {
        setGameState((prev) => ({
          ...prev,
          highScore: data.data()?.highScore || gameState.highScore,
        }));
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    } else {
      const highScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);

      if (highScore) {
        setGameState((prevState) => ({
          ...prevState,
          highScore: JSON.parse(highScore),
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle high score update on firestore
  const updateHighScoreFirestore = useCallback(
    (
      highScore: Record<
        Difficulty,
        {
          value: number;
          playerName: string;
        }
      >
    ) => {
      getDoc(docRef).then((res) => {
        if (res.exists()) {
          updateDoc(docRef, { type: "snake", highScore });
        } else {
          setDoc(docRef, { type: "snake", highScore });
        }
      });
    },
    [docRef]
  );

  // Handle high score
  const handleHighScore = useCallback(() => {
    if (!gameState.difficulty) return;

    const currentHighScore =
      gameState.highScore[gameState.difficulty].value || 0;
    const newHighScore = Math.max(currentHighScore, gameState.score);

    if (currentHighScore < newHighScore) {
      const newFullHighScore: GameState["highScore"] = {
        ...gameState.highScore,
        [gameState.difficulty!]: {
          value: newHighScore,
          playerName: gameState.playerName,
        },
      };

      if (process.env.NEXT_PUBLIC_HIGH_SCORE_MODE === "firestore") {
        updateHighScoreFirestore(newFullHighScore);
      } else {
        // Save high score to local storage
        localStorage.setItem(
          HIGH_SCORE_STORAGE_KEY,
          JSON.stringify(newFullHighScore)
        );
      }

      setGameState((prevState) => ({
        ...prevState,
        highScore: newFullHighScore,
      }));
    }
  }, [
    gameState.difficulty,
    gameState.highScore,
    gameState.score,
    updateHighScoreFirestore,
    gameState.playerName,
  ]);

  // Generate food at random position (not on snake)
  const generateFood = useCallback(
    (snake: Position[]): Position => {
      let newFood: Position;
      let foodOnSnake = true;

      while (foodOnSnake) {
        newFood = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };

        foodOnSnake = snake.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y
        );
      }

      return newFood!;
    },
    [gridSize]
  );

  // Initialize game
  const initGame = useCallback(
    (difficulty: Difficulty) => {
      // Create initial snake in the middle of the board
      const initialSnake: Position[] = [];
      const midPoint = Math.floor(gridSize / 2);

      for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        initialSnake.push({
          x: midPoint - i,
          y: midPoint,
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
        gameStatus: "PLAYING",
        difficulty,
        highScore: gameState.highScore,
        playerName: gameState.playerName || DEFAULT_PLAYER_NAME,
      });

      // Set initial high score
      handleHighScore();
    },
    [
      handleHighScore,
      gameState.highScore,
      generateFood,
      gridSize,
      gameState.playerName,
    ]
  );

  const setPlayerName = useCallback((name: string) => {
    setGameState((prev) => ({
      ...prev,
      playerName: name,
    }));
  }, []);

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState((prevState) => {
      // Prevent 180-degree turns
      if (
        (prevState.direction === "UP" && newDirection === "DOWN") ||
        (prevState.direction === "DOWN" && newDirection === "UP") ||
        (prevState.direction === "LEFT" && newDirection === "RIGHT") ||
        (prevState.direction === "RIGHT" && newDirection === "LEFT")
      ) {
        return prevState;
      }

      return {
        ...prevState,
        nextDirection: newDirection,
      };
    });
  }, []);

  // Move snake
  const moveSnake = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameStatus !== "PLAYING") {
        return prevState;
      }

      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      // Update direction
      const direction = prevState.nextDirection;

      // Move head based on direction
      switch (direction) {
        case "UP":
          head.y = head.y - 1;
          break;
        case "DOWN":
          head.y = head.y + 1;
          break;
        case "LEFT":
          head.x = head.x - 1;
          break;
        case "RIGHT":
          head.x = head.x + 1;
          break;
      }

      // Check for wall collision
      if (
        head.x < 0 ||
        head.x >= gridSize ||
        head.y < 0 ||
        head.y >= gridSize
      ) {
        handleHighScore();

        return {
          ...prevState,
          gameStatus: "GAME_OVER",
        };
      }

      // Check for collision with self (excluding the tail which will move)
      // We check against all segments except the last one (which will move)
      const selfCollision = newSnake
        .slice(0, -1)
        .some((segment) => segment.x === head.x && segment.y === head.y);

      if (selfCollision) {
        handleHighScore();

        return {
          ...prevState,
          gameStatus: "GAME_OVER",
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
        score: newScore,
      };
    });
  }, [handleHighScore, gridSize, generateFood]);

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
      gameStatus: "MENU",
      difficulty: null,
      highScore: gameState.highScore,
      playerName: gameState.playerName,
    });
  }, [gameState.highScore, gameState.playerName]);

  // Handle touch input for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (gameState.gameStatus !== "PLAYING") return;

      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState.gameStatus !== "PLAYING" || !touchStartRef.current) return;

      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      const startX = touchStartRef.current.x;
      const startY = touchStartRef.current.y;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (
        Math.abs(diffX) < MIN_SWIPE_DISTANCE &&
        Math.abs(diffY) < MIN_SWIPE_DISTANCE
      ) {
        return; // Ignore small movements
      }

      let newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT" | null = null;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement
        newDirection = diffX > 0 ? "RIGHT" : "LEFT";
      } else {
        // Vertical movement
        newDirection = diffY > 0 ? "DOWN" : "UP";
      }

      if (newDirection) {
        changeDirection(newDirection);
        // Update reference to avoid triggering the same direction multiple times in a row
        touchStartRef.current = { x: currentX, y: currentY };
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
    };

    // Add event listeners
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [changeDirection, gameState.gameStatus]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== "PLAYING") return;

      switch (e.key) {
        case "ArrowUp":
          changeDirection("UP");
          break;
        case "ArrowDown":
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
          changeDirection("LEFT");
          break;
        case "ArrowRight":
          changeDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeDirection, gameState.gameStatus]);

  // Start/stop game loop based on game status
  useEffect(() => {
    if (gameState.gameStatus === "PLAYING") {
      // if (!gameState.playerName) {
      //   setPlayerName(DEFAULT_PLAYER_NAME);
      // }
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
  }, [
    gameState.gameStatus,
    startGameLoop,
    gameState.playerName,
    setPlayerName,
  ]);

  return {
    gameState,
    initGame,
    resetGame,
    gridSize,
    setPlayerName,
  };
};
