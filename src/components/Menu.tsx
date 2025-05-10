import React, { useState } from "react";
import { Difficulty, GameState } from "@/types";
import HighScore from "./HighScore";
import GamePlayer from "./GamePlayer";

interface MenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  highScore: GameState["highScore"];
  playerName: GameState["playerName"];
  setPlayerName: (val: string) => void;
}

export enum MenuEnum {
  SLUG = "SLUG",
  WORM = "WORM",
  PYTHON = "PYTHON",
}

const Menu: React.FC<MenuProps> = ({
  onSelectDifficulty,
  highScore,
  playerName,
  setPlayerName,
}) => {
  const [menuActive, setMenuActive] = useState<MenuEnum>(MenuEnum.SLUG);

  return (
    <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex flex-col items-center justify-center text-black/75 ring-4 ring-black/75">
      <h1 className="text-3xl sm:text-6xl font-bold mb-6 sm:mb-10 tracking-wider">
        snake
      </h1>

      <div className="text-xxs sm:text-xl font-bold mb-4 sm:mb-10">
        CHOOSE LEVEL:
      </div>

      <div className="flex gap-3">
        {Object.values(MenuEnum).map((menu) => (
          <button
            key={menu}
            onMouseEnter={() => setMenuActive(menu)}
            onClick={() => onSelectDifficulty(menu)}
            className={`text-xs sm:text-xl font-bold p-2 sm:p-3 rounded-md cursor-pointer transition-transform ${
              menuActive === menu ? "bg-black/75 text-[#9bba5a]" : ""
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      <HighScore highScore={highScore} />

      <GamePlayer playerName={playerName} setPlayerName={setPlayerName} />
    </div>
  );
};

export default Menu;
