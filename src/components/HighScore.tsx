import React from "react";
import { MenuEnum } from "./Menu";
import { Difficulty } from "@/types";

interface HighScoreProps {
  highScore: Record<Difficulty, number>;
}

function HighScore({ highScore }: HighScoreProps) {
  console.log({ highScore });

  return (
    <div className="mt-10">
      <div className="text-center mb-3 uppercase">High score:</div>
      <div className="flex gap-6">
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
