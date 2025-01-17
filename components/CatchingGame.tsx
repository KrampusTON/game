import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "@/components/TopInfoSection";
import { bomb, rare, blue, orange, coin } from "@/images";

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
  const [spawnDelay, setSpawnDelay] = useState<number>(1000); // Znížený spawn delay pre viac objektov
  const [gameState, setGameState] = useState<string>("menu");

  const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newX = (touch.clientX / window.innerWidth) * 100;
    setPlayerX(Math.max(0, Math.min(100, newX)));
    e.preventDefault();
  };

  const generateObjectType = (): string => {
    const randomType = Math.random();
    if (randomType < 0.2) return "bomb"; // 20% šanca
    if (randomType < 0.35) return "rare"; // 15% šanca
    if (randomType < 0.45) return "blue"; // 10% šanca
    if (randomType < 0.55) return "orange"; // 10% šanca na "game over"
    return "default"; // 45% šanca
  };

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
    if (gameState !== "playing" || gameOver) return;

    const interval = setInterval(() => {
      setFallingObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.isCaught ? obj.y : obj.y + fallingSpeed }))
          .filter((obj) => obj.y <= 100 || obj.isCaught) // Odstránenie objektov, ktoré prešli hranicu
      );
    }, 50);

    return () => clearInterval(interval);
  }, [fallingSpeed, gameState, gameOver]);

  useEffect(() => {
    setFallingObjects((prev) =>
      prev.map((obj) => {
        const caught = Math.abs(obj.x - playerX) < 15 && obj.y > 90 && !obj.isCaught;
        if (caught) {
          let pointsToAdd = 0;

          switch (obj.type) {
            case "bomb":
              pointsToAdd = -15;
              break;
            case "rare":
              pointsToAdd = 25;
              break;
            case "blue":
              pointsToAdd = 50;
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

          return { ...obj, isCaught: true }; // Označíme objekt ako chytený
        }
        return obj;
      })
    );
  }, [playerX, incrementPoints, gameOver]);

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
        setSpawnDelay((prev) => Math.max(prev - 50, 500)); // Zníženie spawn delay pre vyššiu frekvenciu
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, gameOver]);

  return (
    <div className="bg-black flex justify-center items-center min-h-screen overflow-hidden fixed inset-0">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl relative">
        <TopInfoSection isGamePage={true} setCurrentView={setCurrentView} />
        {gameState === "menu" && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl mb-4">Vitajte v hre!</h1>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md text-lg"
              onClick={() => setGameState("playing")}
            >
              Play
            </button>
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
                left: `${playerX}%`,
                width: "20%",
                height: "20px",
                backgroundColor: "white",
                transform: "translateX(-50%)",
                bottom: "20%",
                position: "absolute",
                borderRadius: "10px",
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
                  transform: obj.isCaught ? "scale(0)" : "scale(1)",
                  transition: obj.isCaught ? "transform 0.3s ease-out" : "none",
                }}
              />
            ))}
            <div className="absolute top-4 left-4 text-xl">{`Čas: ${timeLeft}s`}</div>
            <div className="absolute top-4 right-4 text-xl">{`Skóre: ${score}`}</div>
          </div>
        )}
        {gameState === "gameOver" && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl mb-4">Hra skončila!</h1>
            <p className="text-xl mb-4">{`Vaše skóre: ${score}`}</p>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md text-lg"
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
              Znova hrať
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
