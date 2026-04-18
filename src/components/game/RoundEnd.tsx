import { useState } from "react";
import type { Player } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoundEndProps {
  winner: Player | null;
  phrase: string;
  players: Player[];
  onNewRound: () => void;
  onEndGame: () => void;
}

export function RoundEnd({ winner, phrase, players, onNewRound, onEndGame }: RoundEndProps) {
  const [fullResetDialogOpen, setFullResetDialogOpen] = useState(false);

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
                color: winner.color,
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
                  backgroundColor: `${player.color}11`,
                  border: `1px solid ${player.color}33`,
                }}
              >
                <span
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: player.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: player.color,
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  {player.name}
                </span>
                <span
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#FFFFFF",
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
            onClick={() => setFullResetDialogOpen(true)}
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

      {/* Full Reset confirmation dialog */}
      <AlertDialog open={fullResetDialogOpen} onOpenChange={setFullResetDialogOpen}>
        <AlertDialogContent
          style={{
            backgroundColor: "#0F1D32",
            border: "1px solid rgba(220, 38, 38, 0.3)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#DC2626",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              End Game
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              This will erase all scores and session data and return to the player setup screen. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onEndGame();
                setFullResetDialogOpen(false);
              }}
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                backgroundColor: "#DC2626",
                color: "#FFFFFF",
                border: "none",
              }}
            >
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
