import type { Player } from "./types";

interface RoundEndProps {
  winner: Player | null;
  phrase: string;
  players: Player[];
  onNewRound: () => void;
  onEndGame: () => void;
}

export function RoundEnd({ winner, phrase, players, onNewRound, onEndGame }: RoundEndProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#0A1628",
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ maxWidth: 560, width: "100%", padding: 32 }}>
        {/* Winner announcement */}
        <div className="text-center">
          <h2
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            Round Complete
          </h2>
          {winner && (
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: "#F5C518",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginTop: 12,
              }}
            >
              {winner.name} Wins!
            </div>
          )}
        </div>

        {/* Puzzle answer */}
        <div
          className="text-center px-6 py-4 rounded w-full"
          style={{
            backgroundColor: "rgba(27, 107, 74, 0.2)",
            border: "1px solid rgba(27, 107, 74, 0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            The Puzzle Was
          </div>
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {phrase}
          </div>
        </div>

        {/* Scores */}
        <div className="w-full flex flex-col gap-2">
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            Total Scores
          </div>
          {players
            .slice()
            .sort((a, b) => b.totalScore - a.totalScore)
            .map(player => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 rounded"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#F5C518",
                  }}
                >
                  ${player.totalScore.toLocaleString()}
                </span>
              </div>
            ))}
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={onNewRound}
            className="flex-1 py-4 rounded transition-all"
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: "#F5C518",
              color: "#0A1628",
              border: "none",
              cursor: "pointer",
            }}
          >
            New Round
          </button>
          <button
            onClick={onEndGame}
            className="py-4 px-6 rounded transition-all"
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}
