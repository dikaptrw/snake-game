import React from "react";
import { MenuEnum } from "./Menu";
import { Difficulty } from "@/types";

interface HighScoreProps {
  highScore: Record<Difficulty, number>;
}

function HighScore({ highScore }: HighScoreProps) {
  console.log({ highScore });

  return (
    <div className="mt-6 sm:mt-10 text-xxs sm:text-base">
      <div className="text-center mb-3 uppercase">High score:</div>
      <div className="flex gap-3 sm:gap-6">
        {Object.values(MenuEnum).map((menu) => (
          <div key={menu} className="flex">
            <div>{menu}: </div>
            <div>{highScore[menu]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HighScore;
