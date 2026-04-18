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

interface SessionControlsProps {
  isRoundInProgress: boolean;
  onNewGame: () => void;
  onFullReset: () => void;
  roundNumber: number;
}

export function SessionControls({ isRoundInProgress, onNewGame, onFullReset, roundNumber }: SessionControlsProps) {
  const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);
  const [fullResetDialogOpen, setFullResetDialogOpen] = useState(false);

  return (
    <>
      <div
        className="w-full flex items-center justify-between shrink-0"
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid rgba(245, 197, 24, 0.15)",
          backgroundColor: "rgba(10, 22, 40, 0.98)",
        }}
      >
        {/* Round indicator */}
        <div
          style={{
            fontFamily: "Oswald, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Round {roundNumber}
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
