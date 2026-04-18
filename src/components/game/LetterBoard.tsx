import { VOWELS } from "./types";

interface LetterBoardProps {
  guessedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled: boolean;
  buyingVowel: boolean;
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_PER_ROW = 6;

// Split into rows of 6
const ROWS: string[][] = [];
for (let i = 0; i < ALL_LETTERS.length; i += LETTERS_PER_ROW) {
  ROWS.push(ALL_LETTERS.slice(i, i + LETTERS_PER_ROW));
}

export function LetterBoard({ guessedLetters, onLetterClick, disabled, buyingVowel }: LetterBoardProps) {
  const renderLetter = (letter: string) => {
    const isGuessed = guessedLetters.has(letter);
    const isVowel = VOWELS.has(letter);

    // Only allow vowels when buying, consonants when not buying
    const isWrongType = buyingVowel ? !isVowel : isVowel;
    const isDisabled = disabled || isGuessed || isWrongType;

    return (
      <button
        key={letter}
        onClick={() => !isDisabled && onLetterClick(letter)}
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
          backgroundColor: isGuessed
            ? "rgba(255,255,255,0.05)"
            : isDisabled
              ? "rgba(255,255,255,0.08)"
              : isVowel
                ? "#F5C518"
                : "rgba(255,255,255,0.15)",
          color: isGuessed
            ? "rgba(255,255,255,0.15)"
            : isDisabled
              ? "rgba(255,255,255,0.25)"
              : isVowel
                ? "#0A1628"
                : "#FFFFFF",
          cursor: isDisabled ? "not-allowed" : "pointer",
          border: isGuessed ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1">
          {row.map(renderLetter)}
          {/* Pad the last row so buttons stay the same width */}
          {row.length < LETTERS_PER_ROW &&
            Array.from({ length: LETTERS_PER_ROW - row.length }).map((_, i) => (
              <div key={`pad-${i}`} style={{ flex: "1 1 0", minWidth: 0 }} />
            ))}
        </div>
      ))}
    </div>
  );
}
