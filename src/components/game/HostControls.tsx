import { useState } from "react";
import { LetterBoard } from "./LetterBoard";
import type { GameState, TurnPhase, WheelResult } from "./types";

interface HostControlsProps {
  gameState: GameState;
  onLetterClick: (letter: string) => void;
  onBuyVowelToggle: () => void;
  onSolve: (guess: string) => void;
  onNextPlayer: () => void;
  buyingVowel: boolean;
  currentSpinResult: WheelResult | null;
  turnPhase: TurnPhase;
}

export function HostControls({
  gameState,
  onLetterClick,
  onBuyVowelToggle,
  onSolve,
  onNextPlayer,
  buyingVowel,
  turnPhase,
}: HostControlsProps) {
  const [solveMode, setSolveMode] = useState(false);
  const [solveGuess, setSolveGuess] = useState("");

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const hasUnguessedVowels = ["A", "E", "I", "O", "U"].some(v => !gameState.guessedLetters.has(v));
  const canBuyVowel = currentPlayer && hasUnguessedVowels;
  const isRoundComplete = turnPhase === "roundComplete";

  const letterBoardDisabled = isRoundComplete || (turnPhase !== "guessing" && turnPhase !== "buyingVowel");

  const handleSolveSubmit = () => {
    onSolve(solveGuess);
    setSolveGuess("");
    setSolveMode(false);
  };

  return (
    <div className="flex flex-col gap-3" style={{ padding: "8px 12px 16px" }}>
      {/* Letter board */}
      <LetterBoard
        guessedLetters={gameState.guessedLetters}
        onLetterClick={onLetterClick}
        disabled={letterBoardDisabled}
        buyingVowel={buyingVowel}
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Buy a Vowel */}
        <button
          onClick={onBuyVowelToggle}
          disabled={
            isRoundComplete || !canBuyVowel || turnPhase === "spinning" || turnPhase === "solving" || buyingVowel
          }
          className="w-full py-2 px-3 rounded font-bold text-sm transition-all"
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            backgroundColor: buyingVowel
              ? "#F5C518"
              : canBuyVowel && turnPhase !== "spinning"
                ? "rgba(245, 197, 24, 0.15)"
                : "rgba(255,255,255,0.05)",
            color: buyingVowel ? "#0A1628" : canBuyVowel ? "#F5C518" : "rgba(255,255,255,0.25)",
            border: buyingVowel ? "1px solid #F5C518" : "1px solid rgba(245, 197, 24, 0.2)",
            cursor: !canBuyVowel || turnPhase === "spinning" ? "not-allowed" : "pointer",
          }}
        >
          {buyingVowel ? "Pick a Vowel..." : "Buy a Vowel ($250)"}
        </button>

        {/* Solve Puzzle */}
        {!solveMode ? (
          <button
            onClick={() => setSolveMode(true)}
            disabled={isRoundComplete || turnPhase === "spinning"}
            className="w-full py-2 px-3 rounded font-bold text-sm transition-all"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backgroundColor: "rgba(255,255,255,0.1)",
              color: isRoundComplete || turnPhase === "spinning" ? "rgba(255,255,255,0.25)" : "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: isRoundComplete || turnPhase === "spinning" ? "not-allowed" : "pointer",
            }}
          >
            Solve Puzzle
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={solveGuess}
              onChange={e => setSolveGuess(e.target.value.toUpperCase())}
              placeholder="Type the player's answer..."
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.2)",
                outline: "none",
                textTransform: "uppercase",
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && solveGuess.trim()) {
                  handleSolveSubmit();
                }
              }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSolveSubmit}
                disabled={!solveGuess.trim()}
                className="flex-1 py-2 px-3 rounded font-bold text-sm transition-all"
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                  backgroundColor: solveGuess.trim() ? "#059669" : "rgba(255,255,255,0.05)",
                  color: solveGuess.trim() ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                  cursor: solveGuess.trim() ? "pointer" : "not-allowed",
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setSolveMode(false);
                  setSolveGuess("");
                }}
                className="py-2 px-3 rounded text-sm transition-all"
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 500,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Next Player */}
        <button
          onClick={onNextPlayer}
          disabled={isRoundComplete || turnPhase === "spinning"}
          className="w-full py-2 px-3 rounded font-bold text-sm transition-all"
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            backgroundColor: "rgba(255,255,255,0.05)",
            color: isRoundComplete || turnPhase === "spinning" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: isRoundComplete || turnPhase === "spinning" ? "not-allowed" : "pointer",
          }}
        >
          Next Player
        </button>
      </div>
    </div>
  );
}
