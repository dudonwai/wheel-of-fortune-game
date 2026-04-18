import type { Player } from "./types";

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  return (
    <div
      className="w-full flex items-stretch justify-center gap-0"
      style={{
        borderTop: "2px solid #F5C518",
        backgroundColor: "rgba(10, 22, 40, 0.95)",
      }}
    >
      {players.map((player, idx) => {
        const isActive = idx === currentPlayerIndex;
        return (
          <div
            key={player.id}
            className="flex-1 flex flex-col items-center py-3 px-4 relative"
            style={{
              borderBottom: isActive ? "3px solid #F5C518" : "3px solid transparent",
              animation: isActive ? "pulseGold 2s ease-in-out infinite" : "none",
              maxWidth: 220,
            }}
          >
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: isActive ? "#F5C518" : "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              {player.name}
            </div>
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 32,
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.1,
                marginTop: 2,
              }}
            >
              ${player.roundScore.toLocaleString()}
            </div>
            <div
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Total: ${player.totalScore.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
