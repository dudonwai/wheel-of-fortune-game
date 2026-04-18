import { useState } from "react";
import type { Player } from "./types";
import { FINAL_ROUND_FREE_LETTERS } from "./types";

interface FinalRoundSetupProps {
  finalist: Player;
  onStartFinalRound: (phrase: string, category: string) => void;
  onCancel: () => void;
}

export function FinalRoundSetup({ finalist, onStartFinalRound, onCancel }: FinalRoundSetupProps) {
  const [phrase, setPhrase] = useState("");
  const [category, setCategory] = useState("");

  const MAX_CATEGORY = 40;
  const MAX_PHRASE = 52;
  const canStart = phrase.trim().length >= 2 && category.trim().length >= 1;

  const handleStart = () => {
    if (!canStart) return;
    onStartFinalRound(phrase.trim().toUpperCase(), category.trim().toUpperCase());
  };

  const freeLetters = [...FINAL_ROUND_FREE_LETTERS].sort().join(", ");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#0A1628",
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ maxWidth: 560, width: "100%", padding: 32 }}>
        {/* Title */}
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
            Final Round
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
            The bonus round
          </p>
        </div>

        {/* Finalist display */}
        <div
          className="w-full text-center px-6 py-5 rounded"
          style={{
            backgroundColor: `${finalist.color}15`,
            border: `2px solid ${finalist.color}55`,
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
            Finalist
          </div>
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 40,
              fontWeight: 700,
              color: finalist.color,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {finalist.name}
          </div>
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: 4,
            }}
          >
            ${finalist.totalScore.toLocaleString()}
          </div>
        </div>

        {/* Free letters info */}
        <div
          className="w-full text-center px-4 py-3 rounded"
          style={{
            backgroundColor: "rgba(245, 197, 24, 0.08)",
            border: "1px solid rgba(245, 197, 24, 0.2)",
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
              marginBottom: 4,
            }}
          >
            Free letters (auto-revealed)
          </div>
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#F5C518",
              letterSpacing: "0.12em",
            }}
          >
            {freeLetters}
          </div>
        </div>

        {/* Category input */}
        <div className="w-full">
          <label
            htmlFor="final-category"
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
            id="final-category"
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value.slice(0, MAX_CATEGORY))}
            maxLength={MAX_CATEGORY}
            placeholder={'e.g. "Thing"'}
            className="w-full px-4 py-3 rounded"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              border: "2px solid rgba(255,255,255,0.1)",
              outline: "none",
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
            htmlFor="final-phrase"
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
            id="final-phrase"
            type="text"
            value={phrase}
            onChange={e => setPhrase(e.target.value.slice(0, MAX_PHRASE))}
            maxLength={MAX_PHRASE}
            placeholder={'e.g. "KITCHEN TABLE"'}
            className="w-full px-4 py-3 rounded"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              border: "2px solid rgba(255,255,255,0.1)",
              outline: "none",
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

        {/* Start Final Round button */}
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
          Start Final Round
        </button>

        {/* Back button */}
        <button
          onClick={onCancel}
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
          Back
        </button>
      </div>
    </div>
  );
}
