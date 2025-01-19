import React, { useEffect, useState } from "react";

interface CollisionEffectProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const CollisionEffect: React.FC<CollisionEffectProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 10 }, (_, i) => i)); // Vygeneruj 10 častíc
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - 25,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Hlavný kruh */}
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: color,
          borderRadius: "50%",
          animation: "scaleAndFade 0.5s ease-out forwards",
        }}
      />
      {/* Častice */}
      {particles.map((_, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            width: "10px",
            height: "10px",
            backgroundColor: color,
            borderRadius: "50%",
            top: "25px",
            left: "25px",
            transformOrigin: "center",
            animation: `particleMove 0.5s ease-out forwards`,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};
