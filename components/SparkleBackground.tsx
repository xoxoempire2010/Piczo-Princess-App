import React, { useEffect, useState } from 'react';
import { SparkleType } from '../types';

const SparkleBackground: React.FC = () => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: SparkleType[] = [];
      for (let i = 0; i < 30; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 5,
          delay: Math.random() * 5,
        });
      }
      setSparkles(newSparkles);
    };
    generateSparkles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute text-white animate-twinkle opacity-70"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            textShadow: '0 0 5px #fff, 0 0 10px #ff6ec7'
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
};

export default SparkleBackground;