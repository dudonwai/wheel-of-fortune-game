import { useState } from "react";
import { PLAYER_COLORS } from "./types";

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
}

export function SetupScreen({ onStartGame }: SetupScreenProps) {
  const [numPlayers, setNumPlayers] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", "", "", ""]);

  const handleNumChange = (n: number) => {
    setNumPlayers(n);
  };

  const handleNameChange = (index: number, name: string) => {
    const next = [...playerNames];
    next[index] = name;
    setPlayerNames(next);
  };

  const canStart = Array.from({ length: numPlayers }).every((_, i) => playerNames[i].trim().length > 0);

  const handleStart = () => {
    if (!canStart) return;
    const names = playerNames.slice(0, numPlayers).map(n => n.trim());
    onStartGame(names);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#0A1628",
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ maxWidth: 480, width: "100%", padding: 32 }}>
        {/* Title */}
        <div className="text-center">
          <h1
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#F5C518",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            Wheel of Fortune
          </h1>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Game Setup
          </p>
        </div>

        {/* Number of players */}
        <div className="w-full">
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 8,
            }}
          >
            Number of Players
          </div>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => handleNumChange(n)}
                className="flex-1 py-3 rounded transition-all"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  backgroundColor: numPlayers === n ? "#F5C518" : "rgba(255,255,255,0.08)",
                  color: numPlayers === n ? "#0A1628" : "rgba(255,255,255,0.5)",
                  border: numPlayers === n ? "2px solid #F5C518" : "2px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Player names */}
        <div className="w-full flex flex-col gap-3">
          {Array.from({ length: numPlayers }).map((_, i) => {
            const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
            return (
              <div key={i}>
                <label
                  htmlFor={`player-name-${i}`}
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "flex",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  Player {i + 1}
                </label>
                <input
                  id={`player-name-${i}`}
                  type="text"
                  value={playerNames[i]}
                  onChange={e => handleNameChange(i, e.target.value.toUpperCase())}
                  placeholder={`Enter player ${i + 1} name`}
                  className="w-full px-4 py-3 rounded"
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#FFFFFF",
                    border: `2px solid ${color}44`,
                    outline: "none",
                    textTransform: "uppercase",
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && canStart) {
                      handleStart();
                    }
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded transition-all"
          style={{
            fontFamily: "Oswald, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            backgroundColor: canStart ? "#F5C518" : "rgba(255,255,255,0.05)",
            color: canStart ? "#0A1628" : "rgba(255,255,255,0.2)",
            cursor: canStart ? "pointer" : "not-allowed",
            border: "none",
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
