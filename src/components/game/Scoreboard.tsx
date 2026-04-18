import type { Player } from "./types";

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Section header */}
      <div
        style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          paddingBottom: 4,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        Players
      </div>

      {/* Player cards */}
      {players.map((player, idx) => {
        const isActive = idx === currentPlayerIndex;
        return (
          <div
            key={player.id}
            className="flex items-center gap-3 rounded"
            style={{
              padding: "8px 10px",
              backgroundColor: isActive ? "rgba(245, 197, 24, 0.08)" : "rgba(0,0,0,0.2)",
              border: isActive ? "1px solid rgba(245, 197, 24, 0.3)" : "1px solid rgba(255,255,255,0.04)",
              animation: isActive ? "pulseGold 2s ease-in-out infinite" : "none",
            }}
          >
            {/* Active indicator dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isActive ? "#F5C518" : "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            />

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <div
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: isActive ? "#F5C518" : "rgba(255,255,255,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {player.name}
              </div>
              <div
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  lineHeight: 1.2,
                }}
              >
                Total: ${player.totalScore.toLocaleString()}
              </div>
            </div>

            {/* Round score */}
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ${player.roundScore.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
