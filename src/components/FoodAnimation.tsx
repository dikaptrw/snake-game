import { Position } from "@/types";

interface FoodAnimationProps {
  food: Position;
  gridSize: number;
}

const FoodAnimation: React.FC<FoodAnimationProps> = ({ food }) => {
  const cellSize = 20;

  return (
    <div
      className="absolute text-black text-2xl font-bold pulse-animation"
      style={{
        left: `${food.x * cellSize}px`,
        top: `${food.y * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="15" height="15" fill="#000000" />
        <rect x="2" y="2" width="4" height="4" fill="#ffffff" opacity="0.7" />
      </svg>
    </div>
  );
};

export default FoodAnimation;
