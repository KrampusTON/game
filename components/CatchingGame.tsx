import { useState, useEffect } from "react";

interface FallingObject {
  id: number;
  x: number;
  y: number;
  isCaught: boolean;
}

interface CatchingGameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function CatchingGame({ currentView, setCurrentView }: CatchingGameProps) {
  const [playerX, setPlayerX] = useState<number>(50);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameState, setGameState] = useState<string>("menu");

  const objectSize = 5; // Percentuálna šírka objektu
  const platformWidth = 20; // Percentuálna šírka platformy
  const platformHeight = 2; // Percentuálna výška platformy
  const platformY = 85; // Percentuálna pozícia platformy zhora
  const fallingSpeed = 2; // Rýchlosť padania objektov

  const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newX = (touch.clientX / window.innerWidth) * 100;
    setPlayerX(Math.max(10, Math.min(90, newX)));
    e.preventDefault();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setFallingObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: 0,
          isCaught: false,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setFallingObjects((prev) =>
        prev.filter((obj) => {
          const isColliding =
            obj.x + objectSize >= playerX - platformWidth / 2 &&
            obj.x <= playerX + platformWidth / 2 &&
            obj.y + objectSize >= platformY &&
            obj.y < platformY + platformHeight;

          if (isColliding) {
            setScore((prevScore) => prevScore + 10);
            return false; // Objekt zmizne
          }

          return obj.y <= 100; // Zachová iba objekty, ktoré sú v hre
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [playerX, gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("gameOver");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      style={{ touchAction: "none" }}
      onTouchStart={handleMove}
      onTouchMove={handleMove}
    >
      <div className="w-full h-full flex flex-col items-center text-white">
        {gameState === "menu" && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl mb-4">Catch the Objects!</h1>
            <button
              className="bg-blue-500 px-6 py-2 rounded-md"
              onClick={() => setGameState("playing")}
            >
              Play
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="relative w-full h-full">
            {fallingObjects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  position: "absolute",
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  width: `${objectSize}%`,
                  height: `${objectSize}%`,
                  backgroundColor: "red",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: `${playerX - platformWidth / 2}%`,
                bottom: `${100 - platformY}%`,
                width: `${platformWidth}%`,
                height: `${platformHeight}%`,
                backgroundColor: "white",
              }}
            />
            <div className="absolute top-4 left-4 text-xl">{`Score: ${score}`}</div>
            <div className="absolute top-4 right-4 text-xl">{`Time: ${timeLeft}s`}</div>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl mb-4">Game Over!</h1>
            <p className="text-xl mb-4">{`Your Score: ${score}`}</p>
            <button
              className="bg-blue-500 px-6 py-2 rounded-md"
              onClick={() => {
                setGameState("menu");
                setScore(0);
                setTimeLeft(60);
                setFallingObjects([]);
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
