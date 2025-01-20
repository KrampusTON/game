import React, { useEffect } from "react";

interface CollisionEffectProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void; // Callback po dokončení efektu
}

export const CollisionEffect: React.FC<CollisionEffectProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  useEffect(() => {
    // Po 500 ms odstráni efekt
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - 35, // Jemný posun efektu nad platformu
        width: "50px",
        height: "50px",
        backgroundColor: color,
        borderRadius: "50%",
        transform: "translate(-50%, -50%) scale(1)",
        animation: "collision-pulse 0.5s ease-out forwards",
      }}
    />
  );
};
