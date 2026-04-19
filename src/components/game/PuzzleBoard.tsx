import { useEffect, useState } from "react";

interface PuzzleBoardProps {
  phrase: string;
  revealedLetters: Set<string>;
  category: string;
  newlyRevealed: string[];
}

interface TileState {
  flipping: boolean;
  glowing: boolean;
  revealed: boolean;
}

export function PuzzleBoard({ phrase, revealedLetters, category, newlyRevealed }: PuzzleBoardProps) {
  const [tileStates, setTileStates] = useState<Map<number, TileState>>(new Map());

  // Handle flip animation when new letters are revealed
  useEffect(() => {
    if (newlyRevealed.length === 0) return;

    // Find which tile indices need to flip
    const indicesToFlip: number[] = [];
    phrase.split("").forEach((char, idx) => {
      if (newlyRevealed.includes(char.toUpperCase())) {
        indicesToFlip.push(idx);
      }
    });

    // Stagger the flips with 150ms delay
    indicesToFlip.forEach((tileIdx, staggerIdx) => {
      const delay = staggerIdx * 150;
      setTimeout(() => {
        setTileStates(prev => {
          const next = new Map(prev);
          next.set(tileIdx, { flipping: true, glowing: true, revealed: true });
          return next;
        });

        // Remove glow after 400ms
        setTimeout(() => {
          setTileStates(prev => {
            const next = new Map(prev);
            const current = next.get(tileIdx);
            if (current) {
              next.set(tileIdx, { ...current, glowing: false });
            }
            return next;
          });
        }, 400);

        // Remove flipping after 600ms
        setTimeout(() => {
          setTileStates(prev => {
            const next = new Map(prev);
            const current = next.get(tileIdx);
            if (current) {
              next.set(tileIdx, { ...current, flipping: false });
            }
            return next;
          });
        }, 600);
      }, delay);
    });
  }, [newlyRevealed, phrase]);

  const words = phrase.split(" ");
  let globalCharIndex = 0;

  return (
    <div className="flex flex-col items-center gap-6" style={{ perspective: "1000px" }}>
      {/* Category label */}
      <div
        className="text-center px-6 py-2 rounded"
        style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "#F5C518",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          backgroundColor: "rgba(245, 197, 24, 0.08)",
          border: "1px solid rgba(245, 197, 24, 0.2)",
        }}
      >
        {category}
      </div>

      {/* Puzzle tiles */}
      <div className="flex flex-wrap justify-center gap-y-2 gap-x-6 sm:gap-y-3 sm:gap-x-8 w-full max-w-full px-2">
        {words.map((word, wordIdx) => {
          // Account for the space before the word
          if (wordIdx > 0) {
            globalCharIndex++;
          }
          
          const wordStartIndex = globalCharIndex;
          globalCharIndex += word.length;
          
          // Don't render empty word containers if there were double spaces
          if (word.length === 0) return null;

          return (
            <div key={wordIdx} className="flex flex-wrap justify-center gap-1">
              {word.split("").map((char, charIdx) => {
                const upperChar = char.toUpperCase();
                const isLetter = /[A-Z]/.test(upperChar);
                const currentGlobalIdx = wordStartIndex + charIdx;

                if (!isLetter) {
                  // Punctuation — always revealed
                  return (
                    <div
                      key={currentGlobalIdx}
                      className="flex items-center justify-center w-6 h-7 sm:w-8 sm:h-9 text-base sm:text-lg shrink-0"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 3,
                        fontFamily: "Oswald, sans-serif",
                        fontWeight: 700,
                        color: "#0A1628",
                      }}
                    >
                      {char}
                    </div>
                  );
                }

                const isRevealed = revealedLetters.has(upperChar);
                const state = tileStates.get(currentGlobalIdx);
                const isFlipping = state?.flipping ?? false;
                const isGlowing = state?.glowing ?? false;

                return (
                  <div
                    key={currentGlobalIdx}
                    className="flex items-center justify-center w-6 h-7 sm:w-8 sm:h-9 text-base sm:text-lg shrink-0"
                    style={{
                      borderRadius: 3,
                      backgroundColor: isRevealed ? "#FFFFFF" : "#1B6B4A",
                      border: isRevealed ? "none" : "2px solid rgba(255,255,255,0.1)",
                      fontFamily: "Oswald, sans-serif",
                      fontWeight: 700,
                      color: "#0A1628",
                      transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 600ms cubic-bezier(0.68, -0.35, 0.27, 1.35)",
                      transformStyle: "preserve-3d",
                      boxShadow: isGlowing ? "0 0 24px #F5C518" : "none",
                    }}
                  >
                    {isRevealed ? upperChar : ""}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
