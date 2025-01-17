import { useState, useEffect, useRef } from "react";
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
  isRemoved: boolean; // Nový stav pre odstránenie po animácii
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
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [fallingSpeed, setFallingSpeed] = useState<number>(2);
  const [spawnDelay, setSpawnDelay] = useState<number>(1000);
  const [gameState, setGameState] = useState<string>("menu");

  const playerXRef = useRef<number>(50); // Ref pre presnú pozíciu platformy

  const handleMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const newX = (touch.clientX / window.innerWidth) * 100;
    const clampedX = Math.max(10, Math.min(90, newX));
    playerXRef.current = clampedX; // Aktualizácia ref hodnoty
  };

  const generateObjectType = (): string => {
    const randomType = Math.random();
    if (randomType < 0.2) return "bomb";
    if (randomType < 0.35) return "rare";
    if (randomType < 0.45) return "blue";
    if (randomType < 0.55) return "orange";
    return "default";
  };

  const objectSize = 4.5; // Veľkosť objektu v percentách
  const platformWidth = 20; // Šírka platformy v percentách
  const platformBottom = 85; // Dolná hranica platformy
  const platformTop = 95; // Horná hranica platformy

  // Generovanie nových objektov
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
          isRemoved: false,
        },
      ]);
    }, spawnDelay);

    return () => clearInterval(interval);
  }, [spawnDelay, gameState, gameOver]);

  // Aktualizácia pozícií objektov
  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const interval = setInterval(() => {
      setFallingObjects((prev) =>
        prev
          .map((obj) => {
            if (obj.isCaught) {
              // Zastav chytené objekty na platforme
              return { ...obj, y: platformBottom };
            }
            return { ...obj, y: obj.y + fallingSpeed };
          })
          .filter((obj) => !obj.isRemoved && obj.y <= 100) // Odstráň chytené objekty po animácii
      );
    }, 50);

    return () => clearInterval(interval);
  }, [fallingSpeed, gameState, gameOver]);

  // Kontrola kolízie s platformou
  useEffect(() => {
    setFallingObjects((prev) =>
      prev.map((obj) => {
        const playerX = playerXRef.current; // Presná pozícia platformy

        const caught =
          obj.x + objectSize / 2 >= playerX - platformWidth / 2 && // Pravý okraj platformy
          obj.x - objectSize / 2 <= playerX + platformWidth / 2 && // Ľavý okraj platformy
          obj.y + objectSize / 2 > platformBottom && // Spodný okraj objektu
          obj.y - objectSize / 2 <= platformTop && // Horný okraj objektu
          !obj.isCaught;

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

          // Objekt zastavíme na platforme a označíme ako chytený
          return { ...obj, isCaught: true };
        }
        return obj;
      })
    );
  }, [incrementPoints, gameOver]);

  // Odstránenie objektov po animácii
  useEffect(() => {
    const interval = setInterval(() => {
      setFallingObjects((prev) =>
        prev.map((obj) => {
          if (obj.isCaught && !obj.isRemoved) {
            // Odstrániť objekt po animácii
            return { ...obj, isRemoved: true };
          }
          return obj;
        })
      );
    }, 300); // Po animácii 300 ms

    return () => clearInterval(interval);
  }, []);

  // Časovač hry
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
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl relative">
          <TopInfoSection isGamePage={true} setCurrentView={setCurrentView} />
          {gameState === "menu" && (
            <div className="flex flex-col items-center justify-center h-full">
              <Image src={rare} alt="Logo" width={200} height={200} className="mb-4" />
              <h1 className="text-3xl mb-4">Catch $PeGo!</h1>
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
                  left: `${playerXRef.current - platformWidth / 2}%`,
                  width: `${platformWidth}%`,
                  height: "20px",
                  backgroundColor: "white",
                  transform: "translateX(0)",
                  bottom: "25%",
                  position: "absolute",
                  border: "2px solid red",
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
                    opacity: obj.isCaught ? 0 : 1,
                    transform: obj.isCaught ? "scale(0)" : "scale(1)",
                    transition: obj.isCaught
                      ? "transform 0.3s ease-out, opacity 0.3s ease-out"
                      : "none",
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
                Play again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
