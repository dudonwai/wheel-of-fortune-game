import { useState } from "react";
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
import type { Player } from "./types";

interface SessionControlsProps {
  isRoundInProgress: boolean;
  onNewGame: () => void;
  onFullReset: () => void;
  roundNumber: number;
  players: Player[];
  currentPlayerIndex: number;
}

export function SessionControls({
  isRoundInProgress,
  onNewGame,
  onFullReset,
  roundNumber,
  players,
  currentPlayerIndex,
}: SessionControlsProps) {
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);
  const [fullResetDialogOpen, setFullResetDialogOpen] = useState(false);

  return (
    <>
      <div
        className="w-full flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-3 md:gap-0"
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid rgba(245, 197, 24, 0.15)",
          backgroundColor: "rgba(10, 22, 40, 0.98)",
        }}
      >
        {/* Left: Round indicator + Player scores */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4" style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Round {roundNumber}
          </div>

          {/* Player scores */}
          <div className="flex items-center gap-2" style={{ minWidth: 0, flexWrap: "wrap" }}>
            {players.map((player, idx) => {
              const isActive = idx === currentPlayerIndex;
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-1.5 rounded px-2.5 py-1"
                  style={{
                    backgroundColor: isActive ? `${player.color}22` : "rgba(255,255,255,0.04)",
                    border: isActive ? `2px solid ${player.color}` : "2px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: player.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Oswald, sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: isActive ? player.color : "rgba(255,255,255,0.6)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {player.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ${player.totalScore.toLocaleString()}
                    {player.roundScore !== 0 && (
                      <span style={{ color: player.roundScore > 0 ? "#4ade80" : "#f87171", marginLeft: 2 }}>
                        {player.roundScore > 0 ? "+" : ""}
                        {player.roundScore.toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewGameDialogOpen(true)}
            className="px-4 py-1.5 rounded transition-all"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: "rgba(245, 197, 24, 0.12)",
              color: "#F5C518",
              border: "1px solid rgba(245, 197, 24, 0.25)",
              cursor: "pointer",
            }}
          >
            New Game
          </button>
          <button
            onClick={() => setFullResetDialogOpen(true)}
            className="px-4 py-1.5 rounded transition-all"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            Full Reset
          </button>
        </div>
      </div>

      {/* New Game confirmation dialog */}
      <AlertDialog open={newGameDialogOpen} onOpenChange={setNewGameDialogOpen}>
        <AlertDialogContent
          style={{
            backgroundColor: "#0F1D32",
            border: "1px solid rgba(245, 197, 24, 0.2)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#F5C518",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Start New Game
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {isRoundInProgress
                ? "This round is still in progress. Current round scores will be discarded, but session totals from completed rounds are preserved."
                : "Start a new round with a fresh puzzle. Session totals will carry over."}
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
                onNewGame();
                setNewGameDialogOpen(false);
              }}
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                backgroundColor: "#F5C518",
                color: "#0A1628",
                border: "none",
              }}
            >
              New Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              Full Reset
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
                onFullReset();
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
    </>
  );
}
