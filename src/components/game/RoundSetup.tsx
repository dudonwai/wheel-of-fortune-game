import { useState } from "react";

interface RoundSetupProps {
  roundNumber: number;
  onStartRound: (phrase: string, category: string) => void;
}

export function RoundSetup({ roundNumber, onStartRound }: RoundSetupProps) {
  const [phrase, setPhrase] = useState("");
  const [category, setCategory] = useState("");

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
            onChange={e => setCategory(e.target.value)}
            placeholder={'e.g. "Before and After"'}
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
            onChange={e => setPhrase(e.target.value)}
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
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && canStart) {
                handleStart();
              }
            }}
          />
        </div>

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
      </div>
    </div>
  );
}
