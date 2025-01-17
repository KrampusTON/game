import { useState, useEffect } from "react";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "@/components/TopInfoSection";

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

export default function CatchingGame({ currentView, setCurrentView }: CatchingGameProps) {
  const { incrementPoints } = useGameStore();
  const [playerX, setPlayerX] = useState<number>(50);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [fallingSpeed, setFallingSpeed] = useState<number>(2);
  const [spawnDelay, setSpawnDelay] = useState<number>(1200);
  const [gameState, setGameState] = useState<string>("menu");

  const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newX = (touch.clientX / window.innerWidth) * 100;
    setPlayerX(Math.max(0, Math.min(100, newX)));
    e.preventDefault();
  };

  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const interval = setInterval(() => {
      const randomType = Math.random();
      const type =
        randomType < 0.25
          ? "bomb"
          : randomType < 0.35
          ? "rare"
          : randomType < 0.37
          ? "blue"
          : randomType < 0.39
          ? "orange"
          : "default";

      setFallingObjects((prev) => [
        ...prev,
        { id: Date.now(), x: Math.random() * 100, y: 0, type, isCaught: false },
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
          .filter((obj) => obj.y <= 100 || obj.isCaught)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [fallingSpeed, gameState, gameOver]);

  useEffect(() => {
    setFallingObjects((prev) =>
      prev.map((obj) => {
        const caught = Math.abs(obj.x - playerX) < 10 && obj.y > 90 && !obj.isCaught;
        if (caught) {
          let pointsToAdd = 0;

          if (obj.type === "bomb") {
            pointsToAdd = -15;
          } else if (obj.type === "rare") {
            pointsToAdd = 25;
          } else if (obj.type === "blue") {
            pointsToAdd = 50;
          } else if (obj.type === "orange") {
            setGameOver(true);
            setGameState("gameOver");
          } else {
            pointsToAdd = 10;
          }

          if (!gameOver) {
            setScore((prev) => prev + pointsToAdd);
            incrementPoints(pointsToAdd);
          }

          return { ...obj, isCaught: true };
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
        setSpawnDelay((prev) => Math.max(prev - 50, 800));
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
                height: "30px",
                backgroundColor: "white",
                transform: "translateX(-50%)",
                bottom: "10%",
                position: "absolute",
              }}
              className="platform"
            />
            {fallingObjects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  backgroundColor:
                    obj.type === "bomb"
                      ? "red"
                      : obj.type === "rare"
                      ? "yellow"
                      : obj.type === "blue"
                      ? "blue"
                      : obj.type === "orange"
                      ? "orange"
                      : "white",
                  transform: obj.isCaught ? "scale(0)" : "scale(1)",
                  transition: obj.isCaught ? "transform 0.3s ease-out" : "none",
                }}
                className="absolute w-8 h-8 rounded-full"
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
                setSpawnDelay(1200);
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
