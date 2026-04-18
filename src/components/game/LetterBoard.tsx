import { VOWELS } from "./types";

interface LetterBoardProps {
  guessedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled: boolean;
  buyingVowel: boolean;
}

const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ".split("");
const VOWEL_LIST = "AEIOU".split("");

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
          width: 36,
          height: 40,
          fontFamily: "Oswald, sans-serif",
          fontSize: 18,
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
    <div className="flex flex-col gap-3">
      {/* Consonants label */}
      <div
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Consonants
      </div>
      <div className="flex flex-wrap gap-1">{CONSONANTS.map(renderLetter)}</div>

      {/* Vowels label */}
      <div
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginTop: 4,
        }}
      >
        Vowels
      </div>
      <div className="flex gap-1">{VOWEL_LIST.map(renderLetter)}</div>
    </div>
  );
}
