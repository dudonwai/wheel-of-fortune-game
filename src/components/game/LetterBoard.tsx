import { VOWELS } from "./types";

interface LetterBoardProps {
  guessedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled: boolean;
  buyingVowel: boolean;
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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
        className="flex items-center justify-center rounded transition-all text-sm sm:text-base h-10 sm:h-[38px]"
        style={{
          minWidth: 0,
          fontFamily: "Oswald, sans-serif",
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
    <div className="grid grid-cols-7 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-1.5">
      {ALL_LETTERS.map(renderLetter)}
    </div>
  );
}
