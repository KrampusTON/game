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
  const platformTop = 95;

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
        // Kontrola, že objekt je nad platformou a jeho spodná hrana sa dotýka platformy
        const caught =
          obj.x + objectSize / 2 >= playerX - platformWidth / 2 && // Objekt sa nachádza v horizontálnom rozsahu platformy
          obj.x - objectSize / 2 <= playerX + platformWidth / 2 &&
          obj.y + objectSize / 2 >= platformBottom && // Spodná hrana objektu dosiahla platformu
          obj.y - objectSize / 2 < platformBottom; // Objekt neprešiel pod platformu
  
        if (caught) {
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
  
          return false; // Odstráni chytený objekt
        }
  
        return obj.y <= 100; // Odstráni objekty, ktoré sú mimo obrazovky
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
          {gameState === "menu" && (
  <div className="flex flex-col items-center justify-center h-full">
    <Image src={coin} alt="Logo" width={200} height={200} className="mb-4" />
    <h1 className="text-3xl mb-4">Catch $PeGo!</h1>
    <div className="flex gap-4">
      <button
        className="bg-white text-black px-6 py-2 rounded-md text-lg"
        onClick={() => setGameState("playing")}
      >
        Play
      </button>
      <button
        className="bg-gray-500 text-white px-6 py-2 rounded-md text-lg"
        onClick={() => setCurrentView("home")} // Nastaví pohľad na hlavnú stránku
      >
        Back to Home
      </button>
    </div>
  </div>
)}
          {gameState === "playing" && (
            <div
              className="flex-grow bg-black z-0 relative overflow-hidden"
              onTouchStart={handleMove}
              onTouchMove={handleMove}
            >
              <div
                style={{
                  left: `${playerX - platformWidth / 2}%`,
                  width: `${platformWidth}%`,
                  height: "20px",
                  backgroundColor: "white",
                  transform: "translateX(0)",
                  bottom: "20%",
                  position: "absolute",
                  border: "2px solid black",
                }}
                className="platform"
              />
              {fallingObjects.map((obj) => (
                <Image
                  key={obj.id}
                  src={objectImages[obj.type] || objectImages.default}
                  alt={obj.type}
                  width={45}
                  height={45}
                  style={{
                    position: "absolute",
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                  }}
                />
              ))}
              {collisionEffects.map((effect) => (
                <CollisionEffect
                  key={effect.id}
                  x={effect.x}
                  y={effect.y}
                  color={effect.color}
                  onComplete={() => {
                    setCollisionEffects((prev) => prev.filter((e) => e.id !== effect.id));
                  }}
                />
              ))}
              <div className="absolute top-4 left-4 text-xl">{`Time: ${timeLeft}s`}</div>
              <div className="absolute top-4 right-4 text-xl">{`Score: ${score}`}</div>
            </div>
          )}
          {gameState === "gameOver" && (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-3xl mb-4">Game Over!</h1>
    <p className="text-xl mb-4">{`Your Score: ${score}`}</p>
    <div className="flex gap-4">
      <button
        className="bg-white text-black px-6 py-2 rounded-md text-lg"
        onClick={() => {
          setGameState("menu");
          setScore(0);
          setTimeLeft(60);
          setGameOver(false);
          setFallingSpeed(2);
          setSpawnDelay(1000);
          setFallingObjects([]);
        }}
      >
        Play again
      </button>
      <button
        className="bg-gray-500 text-white px-6 py-2 rounded-md text-lg"
        onClick={() => setCurrentView('game')}
      >
        Back to Home
      </button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
