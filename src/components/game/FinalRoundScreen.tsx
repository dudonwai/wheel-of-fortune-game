import { useState, useCallback, useEffect } from "react";
import { PuzzleBoard } from "./PuzzleBoard";
import { VOWELS, FINAL_ROUND_FREE_LETTERS } from "./types";
import type { GameState, FinalRoundState } from "./types";
import { playDingSound, playBuzzerSound, playApplauseSound } from "./sounds";

interface FinalRoundScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onEndGame: () => void;
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_PER_ROW = 6;

const ROWS: string[][] = [];
for (let i = 0; i < ALL_LETTERS.length; i += LETTERS_PER_ROW) {
  ROWS.push(ALL_LETTERS.slice(i, i + LETTERS_PER_ROW));
}

export function FinalRoundScreen({ gameState, setGameState, onEndGame }: FinalRoundScreenProps) {
  const [solveGuess, setSolveGuess] = useState("");
  const [newlyRevealed, setNewlyRevealed] = useState<string[]>([]);

  const finalRound = gameState.finalRound as FinalRoundState;
  const { finalist } = finalRound;

  // Determine which letters the player has picked (beyond the free letters)
  const pickedLetters = new Set<string>();
  gameState.guessedLetters.forEach(l => {
    if (!FINAL_ROUND_FREE_LETTERS.has(l)) {
      pickedLetters.add(l);
    }
  });

  const totalPicksNeeded = 4; // 3 consonants + 1 vowel
  const consonantsPicked = [...pickedLetters].filter(l => !VOWELS.has(l)).length;
  const vowelsPicked = [...pickedLetters].filter(l => VOWELS.has(l)).length;
  const consonantsRemaining = 3 - consonantsPicked;
  const vowelsRemaining = 1 - vowelsPicked;
  const allPicksMade = consonantsPicked + vowelsPicked >= totalPicksNeeded;

  // Auto-transition to solving when all picks are made
  useEffect(() => {
    if (allPicksMade && finalRound.phase === "picking") {
      // Small delay to let the reveal animations play
      const timer = setTimeout(() => {
        setGameState(prev => {
          if (!prev.finalRound || prev.finalRound.phase !== "picking") return prev;
          return {
            ...prev,
            finalRound: {
              ...prev.finalRound,
              phase: "solving",
              consonantPicks: 0,
              vowelPicks: 0,
            },
            message: `${finalist.name}, solve the puzzle!`,
          };
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allPicksMade, finalRound.phase, finalist.name, setGameState]);

  // Handle letter pick during final round
  const handleLetterPick = useCallback(
    (letter: string) => {
      const upperLetter = letter.toUpperCase();
      if (gameState.guessedLetters.has(upperLetter)) return;
      if (FINAL_ROUND_FREE_LETTERS.has(upperLetter)) return;
      if (finalRound.phase !== "picking") return;

      const isVowel = VOWELS.has(upperLetter);

      // Check if they can still pick this type
      if (isVowel && vowelsRemaining <= 0) return;
      if (!isVowel && consonantsRemaining <= 0) return;

      // Reveal the letter
      const phraseUpper = gameState.phrase.toUpperCase();
      const count = phraseUpper.split("").filter(ch => ch === upperLetter).length;

      const newRevealed = new Set(gameState.revealedLetters);
      if (count > 0) {
        newRevealed.add(upperLetter);
        playDingSound();
        setNewlyRevealed([upperLetter]);
        setTimeout(() => setNewlyRevealed([]), 1000);
      } else {
        playBuzzerSound();
      }

      const newGuessed = new Set(gameState.guessedLetters);
      newGuessed.add(upperLetter);

      const newConsonantPicks = isVowel ? finalRound.consonantPicks : finalRound.consonantPicks - 1;
      const newVowelPicks = isVowel ? finalRound.vowelPicks - 1 : finalRound.vowelPicks;

      const pickLabel = isVowel ? "vowel" : "consonant";
      const resultText = count > 0 ? `${count} found` : "not in puzzle";
      const msg = `${finalist.name} picked ${upperLetter} (${pickLabel}) — ${resultText}`;

      setGameState(prev => ({
        ...prev,
        revealedLetters: newRevealed,
        guessedLetters: newGuessed,
        finalRound: prev.finalRound
          ? {
              ...prev.finalRound,
              consonantPicks: newConsonantPicks,
              vowelPicks: newVowelPicks,
            }
          : null,
        message: msg,
      }));
    },
    [
      gameState.guessedLetters,
      gameState.revealedLetters,
      gameState.phrase,
      finalRound.phase,
      finalRound.consonantPicks,
      finalRound.vowelPicks,
      finalist.name,
      vowelsRemaining,
      consonantsRemaining,
      setGameState,
    ],
  );

  // Handle solve attempt
  const handleSolve = useCallback(() => {
    const normalizedGuess = solveGuess.trim().toUpperCase();
    const normalizedPhrase = gameState.phrase.trim().toUpperCase();

    if (normalizedGuess === normalizedPhrase) {
      // Correct!
      try {
        playApplauseSound();
      } catch {
        // Sound failure shouldn't block
      }

      // Reveal all letters
      const allLetters = new Set(gameState.revealedLetters);
      normalizedPhrase.split("").forEach(ch => {
        if (/[A-Z]/.test(ch)) allLetters.add(ch);
      });

      const newLetters = normalizedPhrase
        .split("")
        .filter(ch => /[A-Z]/.test(ch) && !gameState.revealedLetters.has(ch));
      const uniqueNewLetters = [...new Set(newLetters)];
      setNewlyRevealed(uniqueNewLetters);
      setTimeout(() => setNewlyRevealed([]), 2000);

      setGameState(prev => ({
        ...prev,
        revealedLetters: allLetters,
        finalRound: prev.finalRound
          ? {
              ...prev.finalRound,
              phase: "result",
              solved: true,
            }
          : null,
        message: `${finalist.name} solved it!`,
      }));
    } else {
      // Wrong
      playBuzzerSound();

      // Reveal all letters anyway for the result screen
      const allLetters = new Set(gameState.revealedLetters);
      normalizedPhrase.split("").forEach(ch => {
        if (/[A-Z]/.test(ch)) allLetters.add(ch);
      });

      setNewlyRevealed([
        ...new Set(normalizedPhrase.split("").filter(ch => /[A-Z]/.test(ch) && !gameState.revealedLetters.has(ch))),
      ]);
      setTimeout(() => setNewlyRevealed([]), 2000);

      setGameState(prev => ({
        ...prev,
        revealedLetters: allLetters,
        finalRound: prev.finalRound
          ? {
              ...prev.finalRound,
              phase: "result",
              solved: false,
            }
          : null,
        message: `Not quite! The answer was "${normalizedPhrase}"`,
      }));
    }
    setSolveGuess("");
  }, [solveGuess, gameState.phrase, gameState.revealedLetters, finalist.name, setGameState]);

  // Letter rendering for the picking board
  const renderLetter = (letter: string) => {
    const isGuessed = gameState.guessedLetters.has(letter);
    const isFree = FINAL_ROUND_FREE_LETTERS.has(letter);
    const isVowel = VOWELS.has(letter);

    // Determine if this letter type can still be picked
    const canPickConsonant = consonantsRemaining > 0 && !isVowel;
    const canPickVowel = vowelsRemaining > 0 && isVowel;
    const isPicking = finalRound.phase === "picking";
    const isDisabled = !isPicking || isGuessed || isFree || (!canPickConsonant && !canPickVowel);

    return (
      <button
        key={letter}
        onClick={() => !isDisabled && handleLetterPick(letter)}
        disabled={isDisabled}
        className="flex items-center justify-center rounded transition-all"
        style={{
          flex: "1 1 0",
          minWidth: 0,
          height: 38,
          fontFamily: "Oswald, sans-serif",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          backgroundColor: isFree
            ? "rgba(245, 197, 24, 0.25)"
            : isGuessed
              ? "rgba(255,255,255,0.05)"
              : isDisabled
                ? "rgba(255,255,255,0.08)"
                : isVowel
                  ? "#F5C518"
                  : "rgba(255,255,255,0.15)",
          color: isFree
            ? "#F5C518"
            : isGuessed
              ? "rgba(255,255,255,0.15)"
              : isDisabled
                ? "rgba(255,255,255,0.25)"
                : isVowel
                  ? "#0A1628"
                  : "#FFFFFF",
          cursor: isDisabled ? "not-allowed" : "pointer",
          border: isFree
            ? "1px solid rgba(245, 197, 24, 0.4)"
            : isGuessed
              ? "1px solid rgba(255,255,255,0.05)"
              : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {letter}
      </button>
    );
  };

  // Result screen
  if (finalRound.phase === "result") {
    const solved = finalRound.solved === true;
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#0A1628",
          fontFamily: "Archivo, sans-serif",
        }}
      >
        <div className="flex flex-col items-center gap-8" style={{ maxWidth: 600, width: "100%", padding: 32 }}>
          {/* Result announcement */}
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
              Final Round
            </h2>
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 56,
                fontWeight: 700,
                color: solved ? "#F5C518" : "#EF4444",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginTop: 12,
              }}
            >
              {solved ? `${finalist.name} Wins!` : "Not This Time"}
            </div>
          </div>

          {/* Celebration or consolation */}
          {solved ? (
            <div
              className="w-full text-center px-6 py-5 rounded"
              style={{
                backgroundColor: "rgba(245, 197, 24, 0.1)",
                border: "2px solid rgba(245, 197, 24, 0.3)",
              }}
            >
              <div
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#F5C518",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Congratulations
              </div>
              <div
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 4,
                }}
              >
                {finalist.name} solved the bonus puzzle
              </div>
            </div>
          ) : (
            <div
              className="w-full text-center px-6 py-5 rounded"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
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
                The answer was
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
                {gameState.phrase}
              </div>
            </div>
          )}

          {/* Puzzle board showing full answer */}
          <PuzzleBoard
            phrase={gameState.phrase}
            revealedLetters={gameState.revealedLetters}
            category={gameState.category}
            newlyRevealed={[]}
          />

          {/* End Game button */}
          <button
            onClick={onEndGame}
            className="w-full py-4 rounded transition-all"
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: "#F5C518",
              color: "#0A1628",
              border: "none",
              cursor: "pointer",
            }}
          >
            End Game
          </button>
        </div>
      </div>
    );
  }

  // Gameplay screen (picking + solving)
  const statusMessage =
    finalRound.phase === "picking"
      ? consonantsRemaining > 0
        ? `Pick a consonant (${consonantsRemaining} remaining)`
        : `Pick a vowel (${vowelsRemaining} remaining)`
      : "Solve the puzzle";

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "#0A1628", overflow: "hidden" }}>
      {/* Top bar */}
      <div
        className="w-full flex items-center justify-between shrink-0"
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid rgba(245, 197, 24, 0.15)",
          backgroundColor: "rgba(10, 22, 40, 0.98)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#F5C518",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Final Round
          </div>
          <div
            className="flex items-center gap-1.5 rounded px-2.5 py-1"
            style={{
              backgroundColor: `${finalist.color}22`,
              border: `2px solid ${finalist.color}`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: finalist.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: finalist.color,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {finalist.name}
            </span>
          </div>
        </div>
        <div
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {statusMessage}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel: Letter picks + controls */}
        <div
          className="flex flex-col min-h-0"
          style={{
            width: "20%",
            minWidth: 220,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Pick status */}
            <div style={{ padding: "12px 12px 8px" }}>
              <div
                style={{
                  fontFamily: "Oswald, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  paddingBottom: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                Letter Picks
              </div>

              {finalRound.phase === "picking" && (
                <div className="flex flex-col gap-2 mt-3">
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded"
                    style={{
                      backgroundColor: consonantsRemaining > 0 ? "rgba(255,255,255,0.08)" : "rgba(245, 197, 24, 0.1)",
                      border:
                        consonantsRemaining > 0
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(245, 197, 24, 0.3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: consonantsRemaining > 0 ? "#FFFFFF" : "#F5C518",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Consonants
                    </span>
                    <span
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: consonantsRemaining > 0 ? "#FFFFFF" : "#F5C518",
                      }}
                    >
                      {consonantsRemaining}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded"
                    style={{
                      backgroundColor:
                        consonantsRemaining <= 0 && vowelsRemaining > 0
                          ? "rgba(255,255,255,0.08)"
                          : vowelsRemaining <= 0
                            ? "rgba(245, 197, 24, 0.1)"
                            : "rgba(255,255,255,0.04)",
                      border:
                        vowelsRemaining <= 0 ? "1px solid rgba(245, 197, 24, 0.3)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: vowelsRemaining > 0 ? "#FFFFFF" : "#F5C518",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Vowels
                    </span>
                    <span
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: vowelsRemaining > 0 ? "#FFFFFF" : "#F5C518",
                      }}
                    >
                      {vowelsRemaining}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Letter board for picking */}
            {finalRound.phase === "picking" && (
              <div className="flex flex-col gap-1" style={{ padding: "8px 12px 16px" }}>
                {ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map(renderLetter)}
                    {row.length < LETTERS_PER_ROW &&
                      Array.from({ length: LETTERS_PER_ROW - row.length }).map((_, i) => (
                        <div key={`pad-${i}`} style={{ flex: "1 1 0", minWidth: 0 }} />
                      ))}
                  </div>
                ))}
              </div>
            )}

            {/* Solve controls */}
            {finalRound.phase === "solving" && (
              <div className="flex flex-col gap-3" style={{ padding: "12px" }}>
                <div
                  className="text-center py-3 px-4 rounded"
                  style={{
                    backgroundColor: "rgba(245, 197, 24, 0.1)",
                    border: "1px solid rgba(245, 197, 24, 0.25)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Oswald, sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#F5C518",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Time to solve
                  </div>
                  <div
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 2,
                    }}
                  >
                    Enter the player&apos;s answer
                  </div>
                </div>

                <input
                  type="text"
                  value={solveGuess}
                  onChange={e => setSolveGuess(e.target.value.toUpperCase())}
                  placeholder="Type the answer..."
                  className="w-full px-3 py-3 rounded"
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 16,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#FFFFFF",
                    border: "2px solid rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                    outline: "none",
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" && solveGuess.trim()) {
                      handleSolve();
                    }
                  }}
                />
                <button
                  onClick={handleSolve}
                  disabled={!solveGuess.trim()}
                  className="w-full py-3 rounded transition-all"
                  style={{
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    backgroundColor: solveGuess.trim() ? "#F5C518" : "rgba(255,255,255,0.05)",
                    color: solveGuess.trim() ? "#0A1628" : "rgba(255,255,255,0.2)",
                    cursor: solveGuess.trim() ? "pointer" : "not-allowed",
                    border: "none",
                  }}
                >
                  Solve Puzzle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Puzzle Board + message */}
        <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "24px", minWidth: 0 }}>
          {/* Message */}
          <div
            className="text-center mb-8"
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#F5C518",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {gameState.message}
          </div>

          <PuzzleBoard
            phrase={gameState.phrase}
            revealedLetters={gameState.revealedLetters}
            category={gameState.category}
            newlyRevealed={newlyRevealed}
          />

          {/* Free letters reminder */}
          <div
            className="mt-8 px-4 py-2 rounded text-center"
            style={{
              backgroundColor: "rgba(245, 197, 24, 0.06)",
              border: "1px solid rgba(245, 197, 24, 0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Free letters:{" "}
            </span>
            <span
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#F5C518",
                letterSpacing: "0.08em",
              }}
            >
              {[...FINAL_ROUND_FREE_LETTERS].sort().join("  ")}
            </span>
          </div>
        </div>

        {/* Right panel: empty or info */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            width: "20%",
            minWidth: 220,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            padding: 16,
          }}
        >
          <div
            className="text-center"
            style={{
              fontFamily: "Oswald, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Finalist
          </div>
          <div
            className="w-full px-4 py-4 rounded text-center"
            style={{
              backgroundColor: `${finalist.color}11`,
              border: `1px solid ${finalist.color}33`,
            }}
          >
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: finalist.color,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {finalist.name}
            </div>
            <div
              style={{
                fontFamily: "Oswald, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#FFFFFF",
                marginTop: 4,
              }}
            >
              ${finalist.totalScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
