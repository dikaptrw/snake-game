import React from 'react';

interface GameOverAnimationProps {
  onAnimationComplete: () => void;
}

const GameOverAnimation: React.FC<GameOverAnimationProps> = ({ onAnimationComplete }) => {
  // Use useEffect to trigger the animation and call onAnimationComplete when done
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1000); // Animation duration

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div 
        className="text-black text-5xl font-bold animate-bounce"
        style={{
          animation: 'bounce 0.5s ease-in-out 2',
        }}
      >
        GAME OVER!
      </div>
    </div>
  );
};

export default GameOverAnimation;
