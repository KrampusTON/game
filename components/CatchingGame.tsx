import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "@/components/TopInfoSection";
import { bomb, rare, blue, orange, coin } from "@/images";
import { CollisionEffect } from "@/components/CollisionEffect";

// Interface definitions
interface CollisionEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface FallingObject {
  id: number;
  x: number;
  y: number;
  type: string;
  isCaught: boolean;
}

interface CatchingGameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const objectImages: { [key: string]: StaticImageData } = {
  bomb,
  rare,
  blue,
  orange,
  default: coin,
};

export default function CatchingGame({ currentView, setCurrentView }: CatchingGameProps) {
  const { incrementPoints } = useGameStore();
  const [playerX, setPlayerX] = useState<number>(50);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [fallingSpeed, setFallingSpeed] = useState<number>(2);
  const [spawnDelay, setSpawnDelay] = useState<number>(1000);
  const [gameState, setGameState] = useState<string>("menu");
  const [collisionEffects, setCollisionEffects] = useState<CollisionEffect[]>([]);

  const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newX = (touch.clientX / window.innerWidth) * 100;
    setPlayerX(Math.max(10, Math.min(90, newX)));
    e.preventDefault();
  };

  const generateObjectType = (): string => {
    const randomType = Math.random();
    if (randomType < 0.2) return "bomb";
    if (randomType < 0.35) return "rare";
    if (randomType < 0.45) return "blue";
    if (randomType < 0.55) return "orange";
    return "default";
  };

  const getObjectColor = (type: string): string => {
    switch (type) {
      case "bomb":
        return "#ff0000";
      case "rare":
        return "#ffd700";
      case "blue":
        return "#0000ff";
      case "orange":
        return "#ffa500";
      default:
        return "#ffff00";
    }
  };

  const objectSize = 4.5;
  const platformWidth = 20;
  const platformBottom = 85;

  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const interval = setInterval(() => {
      setFallingObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: 0,
          type: generateObjectType(),
          isCaught: false,
        },
      ]);
    }, spawnDelay);

    return () => clearInterval(interval);
  }, [spawnDelay, gameState, gameOver]);

  useEffect(() => {
    setFallingObjects((prev) =>
      prev.filter((obj) => {
        const onPlatform =
          obj.y + objectSize / 2 >= platformBottom &&
          obj.y - objectSize / 2 <= platformBottom + 2 &&
          obj.x + objectSize / 2 >= playerX - platformWidth / 2 &&
          obj.x - objectSize / 2 <= playerX + platformWidth / 2;

        if (onPlatform) {
          const effectX = (obj.x / 100) * window.innerWidth;
          const platformPixelHeight = (platformBottom / 100) * window.innerHeight;
          const effectY = platformPixelHeight - 30;

          setCollisionEffects((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: effectX,
              y: effectY,
              color: getObjectColor(obj.type),
            },
          ]);

          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          let pointsToAdd = 0;

          switch (obj.type) {
            case "bomb":
              pointsToAdd = -15;
              break;
            case "rare":
              pointsToAdd = 15;
              break;
            case "blue":
              pointsToAdd = 30;
              break;
            case "orange":
              setGameOver(true);
              setGameState("gameOver");
              break;
            default:
              pointsToAdd = 10;
          }

          if (!gameOver) {
            setScore((prevScore) => prevScore + pointsToAdd);
            incrementPoints(pointsToAdd);
          }

          return false;
        }

        return obj.y <= 100;
      })
    );
  }, [playerX, incrementPoints, gameOver]);

  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const interval = setInterval(() => {
      setFallingObjects((prev) =>
        prev.map((obj) => ({ ...obj, y: obj.y + fallingSpeed })).filter((obj) => obj.y <= 100)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [fallingSpeed, gameState, gameOver]);

  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setGameState("gameOver");
          return 0;
        }
        return prev - 1;
      });

      if (timeLeft % 5 === 0) {
        setFallingSpeed((prev) => Math.min(prev + 0.5, 10));
        setSpawnDelay((prev) => Math.max(prev - 50, 500));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, gameOver]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ touchAction: "none" }}>
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl relative">
          <TopInfoSection isGamePage={true} setCurrentView={setCurrentView} />
        </div>
      </div>
    </div>
  );
}
