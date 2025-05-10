import { useCallback, useEffect, useRef, useState } from "react";

export interface GamePlayerProps {
  playerName: string;
  setPlayerName: (val: string) => void;
}

export const DEFAULT_PLAYER_NAME = "Anonym";
const MAX_PLAYER_NAME_LENGTH = 10;

function GamePlayer({ playerName, setPlayerName }: GamePlayerProps) {
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (hiddenSpanRef.current) {
      setWidth(hiddenSpanRef.current.offsetWidth - 5);
    }
  }, [playerName]);

  const handleInputOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Limit length client-side for immediate feedback
      const value = e.target.value;
      if (value.length <= MAX_PLAYER_NAME_LENGTH) {
        setPlayerName?.(value);
      }
    },
    [setPlayerName]
  );

  return (
    <div className="flex justify-center items-center mt-4 sm:mt-8 text-xxs sm:text-base">
      {/* hidden span for input width calculation */}
      <span
        ref={hiddenSpanRef}
        className="absolute invisible whitespace-pre px-2"
      >
        {playerName || " "}
      </span>

      <div>PLAYER :</div>
      <input
        ref={inputRef}
        style={{ width }}
        type="text"
        value={playerName}
        placeholder="Name"
        className="min-w-[70px] px-1 border-b-2 focus:outline-none"
        onChange={handleInputOnChange}
      />
    </div>
  );
}

export default GamePlayer;
