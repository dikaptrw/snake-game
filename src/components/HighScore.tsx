import React from "react";
import { MenuEnum } from "./Menu";
import { GameState } from "@/types";

interface HighScoreProps {
  highScore: GameState["highScore"];
}

function HighScore({ highScore }: HighScoreProps) {
  return (
    <div className="mt-4 sm:mt-8 text-xxs sm:text-base">
      <div className="text-center mb-3 uppercase">High score:</div>
      <div className="flex gap-3 sm:gap-6">
        {Object.values(MenuEnum).map((menu) => (
          <div key={menu} className="flex flex-col justify-center items-center">
            <div className="flex">
              <div>{menu}: </div>
              <div>{highScore[menu].value || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighScore;
