import React, { useState } from "react";
import { Difficulty } from "@/types";
import HighScore from "./HighScore";

interface MenuProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  highScore: Record<Difficulty, number>;
}

export enum MenuEnum {
  SLUG = "SLUG",
  WORM = "WORM",
  PYTHON = "PYTHON",
}

const Menu: React.FC<MenuProps> = ({ onSelectDifficulty, highScore }) => {
  const [menuActive, setMenuActive] = useState<MenuEnum>(MenuEnum.SLUG);

  return (
    <div className="w-[500px] h-[500px] flex flex-col items-center justify-center text-black/75 ring-4 ring-black/75">
      <div className="text-6xl font-bold mb-10 flex items-center">
        <span className="tracking-wider">snake</span>
      </div>

      <div className="text-2lg font-bold mb-10">CHOOSE LEVEL:</div>

      <div className="flex gap-3">
        {Object.values(MenuEnum).map((menu) => (
          <button
            key={menu}
            onMouseEnter={() => setMenuActive(menu)}
            onClick={() => onSelectDifficulty(menu)}
            className={`text-xl font-bold px-3 py-3 rounded-md hover:bg-black/75 cursor-pointer hover:text-[#9bba5a] transition-transform ${
              menuActive === menu ? "bg-black/75 text-[#9bba5a]" : ""
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      <HighScore highScore={highScore} />
    </div>
  );
};

export default Menu;
