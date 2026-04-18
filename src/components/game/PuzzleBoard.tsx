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

  // Split phrase into lines for display (max ~14 chars per row)
  const words = phrase.split(" ");
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentLength = 0;

  words.forEach(word => {
    if (currentLength + word.length + (currentLine.length > 0 ? 1 : 0) > 14 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      currentLength = word.length;
    } else {
      currentLine.push(word);
      currentLength += word.length + (currentLine.length > 1 ? 1 : 0);
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

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
      <div className="flex flex-col items-center gap-1">
        {lines.map((lineWords, lineIdx) => {
          const lineChars: { char: string; globalIdx: number }[] = [];
          lineWords.forEach((word, wordIdx) => {
            if (wordIdx > 0) {
              lineChars.push({ char: " ", globalIdx: globalCharIndex });
              globalCharIndex++;
            }
            word.split("").forEach(ch => {
              lineChars.push({ char: ch, globalIdx: globalCharIndex });
              globalCharIndex++;
            });
          });

          return (
            <div key={lineIdx} className="flex gap-1 justify-center">
              {lineChars.map(({ char, globalIdx }) => {
                const upperChar = char.toUpperCase();
                const isLetter = /[A-Z]/.test(upperChar);
                const isSpace = char === " ";

                if (isSpace) {
                  return <div key={globalIdx} style={{ width: 16, height: 36 }} />;
                }

                if (!isLetter) {
                  // Punctuation — always revealed
                  return (
                    <div
                      key={globalIdx}
                      className="flex items-center justify-center"
                      style={{
                        width: 32,
                        height: 36,
                        backgroundColor: "#FFFFFF",
                        borderRadius: 3,
                        fontFamily: "Oswald, sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#0A1628",
                      }}
                    >
                      {char}
                    </div>
                  );
                }

                const isRevealed = revealedLetters.has(upperChar);
                const state = tileStates.get(globalIdx);
                const isFlipping = state?.flipping ?? false;
                const isGlowing = state?.glowing ?? false;

                return (
                  <div
                    key={globalIdx}
                    className="flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 36,
                      borderRadius: 3,
                      backgroundColor: isRevealed ? "#FFFFFF" : "#1B6B4A",
                      border: isRevealed ? "none" : "2px solid rgba(255,255,255,0.1)",
                      fontFamily: "Oswald, sans-serif",
                      fontSize: 18,
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
