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

interface RoundSetupProps {
  roundNumber: number;
  onStartRound: (phrase: string, category: string) => void;
  onFullReset: () => void;
  players: Player[];
}

export function RoundSetup({ roundNumber, onStartRound, onFullReset, players }: RoundSetupProps) {
  const [phrase, setPhrase] = useState("");
  const [category, setCategory] = useState("");
  const [fullResetDialogOpen, setFullResetDialogOpen] = useState(false);

  const MAX_CATEGORY = 40;
  const MAX_PHRASE = 52;
  const canStart = phrase.trim().length >= 2 && category.trim().length >= 1;

  const handleStart = () => {
    if (!canStart) return;
    onStartRound(phrase.trim().toUpperCase(), category.trim().toUpperCase());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#0A1628",
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ maxWidth: 560, width: "100%", padding: 32 }}>
        {/* Round title */}
        <div className="text-center">
          <h2
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: "#F5C518",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            Round {roundNumber}
          </h2>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginTop: 8,
            }}
          >
            Host: Enter the puzzle
          </p>
        </div>

        {/* Category input */}
        <div className="w-full">
          <label
            htmlFor="round-category"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 6,
            }}
          >
            Category
          </label>
          <input
            id="round-category"
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value.toUpperCase().slice(0, MAX_CATEGORY))}
            maxLength={MAX_CATEGORY}
            placeholder={'e.g. "BEFORE AND AFTER"'}
            className="w-full px-4 py-3 rounded"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              border: "2px solid rgba(255,255,255,0.1)",
              outline: "none",
              textTransform: "uppercase",
            }}
          />
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: category.length >= MAX_CATEGORY ? "#F87171" : "rgba(255,255,255,0.3)",
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {category.length}/{MAX_CATEGORY}
          </div>
        </div>

        {/* Phrase input */}
        <div className="w-full">
          <label
            htmlFor="round-phrase"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 6,
            }}
          >
            Phrase
          </label>
          <input
            id="round-phrase"
            type="text"
            value={phrase}
            onChange={e => setPhrase(e.target.value.toUpperCase().slice(0, MAX_PHRASE))}
            maxLength={MAX_PHRASE}
            placeholder={'e.g. "A STITCH IN TIME"'}
            className="w-full px-4 py-3 rounded"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              border: "2px solid rgba(255,255,255,0.1)",
              outline: "none",
              textTransform: "uppercase",
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && canStart) {
                handleStart();
              }
            }}
          />
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: phrase.length >= MAX_PHRASE ? "#F87171" : "rgba(255,255,255,0.3)",
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {phrase.length}/{MAX_PHRASE}
          </div>
        </div>

        {/* Session scores (show if not round 1) */}
        {roundNumber > 1 && players.length > 0 && (
          <div className="w-full">
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
              Session Scores
            </div>
            <div className="flex gap-3">
              {players
                .slice()
                .sort((a, b) => b.totalScore - a.totalScore)
                .map(player => (
                  <div
                    key={player.id}
                    className="flex-1 flex flex-col items-center py-2 px-3 rounded"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {player.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#F5C518",
                      }}
                    >
                      ${player.totalScore.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Start Round button */}
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
          Start Round
        </button>

        {/* Full Reset button */}
        <button
          onClick={() => setFullResetDialogOpen(true)}
          className="w-full py-2 rounded transition-all"
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            backgroundColor: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >
          Change Players / Full Reset
        </button>
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
    </div>
  );
}
