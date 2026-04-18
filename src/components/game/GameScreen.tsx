import { useState, useCallback } from "react";
import { Wheel } from "./Wheel";
import { PuzzleBoard } from "./PuzzleBoard";
import { Scoreboard } from "./Scoreboard";
import { HostControls } from "./HostControls";
import { SessionControls } from "./SessionControls";
import { VOWELS, type GameState, type WheelResult } from "./types";
import { playDingSound, playBuzzerSound, playApplauseSound } from "./sounds";

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNewGame: () => void;
  onFullReset: () => void;
}

export function GameScreen({ gameState, setGameState, onNewGame, onFullReset }: GameScreenProps) {
  const [spinning, setSpinning] = useState(false);
  const [buyingVowel, setBuyingVowel] = useState(false);
  const [newlyRevealed, setNewlyRevealed] = useState<string[]>([]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  // Check if all letters have been revealed
  const checkAllRevealed = useCallback((revealed: Set<string>, phrase: string): boolean => {
    const letters = phrase
      .toUpperCase()
      .split("")
      .filter(ch => /[A-Z]/.test(ch));
    return letters.every(ch => revealed.has(ch));
  }, []);

  // Advance to next player
  const nextPlayer = useCallback(() => {
    setBuyingVowel(false);
    setGameState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
      turnPhase: "idle",
      currentSpinResult: null,
      message: `${prev.players[(prev.currentPlayerIndex + 1) % prev.players.length].name}'s turn`,
    }));
  }, [setGameState]);

  // Win round
  const winRound = useCallback(
    (playerIndex: number) => {
      playApplauseSound();
      setGameState(prev => {
        const updatedPlayers = prev.players.map((p, i) => {
          if (i === playerIndex) {
            return {
              ...p,
              totalScore: p.totalScore + p.roundScore,
            };
          }
          return p;
        });
        return {
          ...prev,
          players: updatedPlayers,
          phase: "roundEnd",
          roundWinner: updatedPlayers[playerIndex],
          message: `${updatedPlayers[playerIndex].name} wins the round!`,
        };
      });
    },
    [setGameState],
  );

  // Handle spin start
  const handleSpinStart = useCallback(() => {
    if (spinning || gameState.turnPhase === "spinning") return;
    setBuyingVowel(false);
    setSpinning(true);
    setGameState(prev => ({
      ...prev,
      turnPhase: "spinning",
      message: `${currentPlayer.name} is spinning...`,
    }));
  }, [spinning, gameState.turnPhase, currentPlayer, setGameState]);

  // Handle spin complete
  const handleSpinComplete = useCallback(
    (result: WheelResult) => {
      setSpinning(false);

      if (result.type === "bankrupt") {
        playBuzzerSound();
        setGameState(prev => {
          const updatedPlayers = prev.players.map((p, i) => {
            if (i === prev.currentPlayerIndex) {
              return { ...p, roundScore: 0 };
            }
            return p;
          });
          return {
            ...prev,
            players: updatedPlayers,
            turnPhase: "idle",
            currentSpinResult: result,
            message: `BANKRUPT! ${currentPlayer.name} loses all round earnings`,
          };
        });
        setTimeout(nextPlayer, 1500);
        return;
      }

      if (result.type === "loseTurn") {
        playBuzzerSound();
        setGameState(prev => ({
          ...prev,
          turnPhase: "idle",
          currentSpinResult: result,
          message: `LOSE A TURN! ${currentPlayer.name}'s turn is over`,
        }));
        setTimeout(nextPlayer, 1500);
        return;
      }

      // Money result — wait for consonant guess
      setGameState(prev => ({
        ...prev,
        turnPhase: "guessing",
        currentSpinResult: result,
        currentWheelValue: result.value,
        message: `$${result.value}! ${currentPlayer.name}, pick a consonant`,
      }));
    },
    [currentPlayer, nextPlayer, setGameState],
  );

  // Handle letter click
  const handleLetterClick = useCallback(
    (letter: string) => {
      const upperLetter = letter.toUpperCase();
      const isVowel = VOWELS.has(upperLetter);

      if (buyingVowel && isVowel) {
        // Buy a vowel
        const phraseUpper = gameState.phrase.toUpperCase();
        const count = phraseUpper.split("").filter(ch => ch === upperLetter).length;

        const newRevealed = new Set(gameState.revealedLetters);
        newRevealed.add(upperLetter);
        const newGuessed = new Set(gameState.guessedLetters);
        newGuessed.add(upperLetter);

        if (count > 0) {
          playDingSound();
          setNewlyRevealed([upperLetter]);
          setTimeout(() => setNewlyRevealed([]), 1000);

          setGameState(prev => {
            const updatedPlayers = prev.players.map((p, i) => {
              if (i === prev.currentPlayerIndex) {
                return { ...p, roundScore: p.roundScore - 250 };
              }
              return p;
            });
            return {
              ...prev,
              players: updatedPlayers,
              revealedLetters: newRevealed,
              guessedLetters: newGuessed,
              turnPhase: "idle",
              currentSpinResult: null,
              message: `${upperLetter} is in the puzzle! (${count} time${count > 1 ? "s" : ""})`,
            };
          });
          setBuyingVowel(false);

          // Check if all letters revealed
          if (checkAllRevealed(newRevealed, gameState.phrase)) {
            setTimeout(() => winRound(gameState.currentPlayerIndex), 800);
          }
        } else {
          playBuzzerSound();
          setGameState(prev => {
            const updatedPlayers = prev.players.map((p, i) => {
              if (i === prev.currentPlayerIndex) {
                return { ...p, roundScore: p.roundScore - 250 };
              }
              return p;
            });
            return {
              ...prev,
              players: updatedPlayers,
              guessedLetters: newGuessed,
              turnPhase: "idle",
              currentSpinResult: null,
              message: `No ${upperLetter} in the puzzle. Turn lost`,
            };
          });
          setBuyingVowel(false);
          setTimeout(nextPlayer, 1200);
        }
        return;
      }

      if (!isVowel && gameState.turnPhase === "guessing") {
        // Consonant guess after spin
        const phraseUpper = gameState.phrase.toUpperCase();
        const count = phraseUpper.split("").filter(ch => ch === upperLetter).length;

        const newRevealed = new Set(gameState.revealedLetters);
        if (count > 0) newRevealed.add(upperLetter);
        const newGuessed = new Set(gameState.guessedLetters);
        newGuessed.add(upperLetter);

        if (count > 0) {
          playDingSound();
          setNewlyRevealed([upperLetter]);
          setTimeout(() => setNewlyRevealed([]), 1000);

          const earned = gameState.currentWheelValue * count;

          setGameState(prev => {
            const updatedPlayers = prev.players.map((p, i) => {
              if (i === prev.currentPlayerIndex) {
                return { ...p, roundScore: p.roundScore + earned };
              }
              return p;
            });
            return {
              ...prev,
              players: updatedPlayers,
              revealedLetters: newRevealed,
              guessedLetters: newGuessed,
              turnPhase: "idle",
              currentSpinResult: null,
              message: `${count} ${upperLetter}${count > 1 ? "'s" : ""}! +$${earned.toLocaleString()}`,
            };
          });

          // Check if all letters revealed
          if (checkAllRevealed(newRevealed, gameState.phrase)) {
            setTimeout(() => winRound(gameState.currentPlayerIndex), 800);
          }
        } else {
          playBuzzerSound();
          setGameState(prev => ({
            ...prev,
            guessedLetters: newGuessed,
            turnPhase: "idle",
            currentSpinResult: null,
            message: `No ${upperLetter} in the puzzle`,
          }));
          setTimeout(nextPlayer, 1200);
        }
      }
    },
    [
      buyingVowel,
      gameState.phrase,
      gameState.revealedLetters,
      gameState.guessedLetters,
      gameState.turnPhase,
      gameState.currentWheelValue,
      gameState.currentPlayerIndex,
      nextPlayer,
      winRound,
      checkAllRevealed,
      setGameState,
    ],
  );

  // Handle buy vowel toggle
  const handleBuyVowelToggle = useCallback(() => {
    setBuyingVowel(true);
    setGameState(prev => ({
      ...prev,
      turnPhase: "buyingVowel",
      message: `${currentPlayer.name} is buying a vowel ($250). Pick one!`,
    }));
  }, [currentPlayer, setGameState]);

  // Handle solve
  const handleSolve = useCallback(
    (guess: string) => {
      const normalizedGuess = guess.trim().toUpperCase();
      const normalizedPhrase = gameState.phrase.trim().toUpperCase();

      if (normalizedGuess === normalizedPhrase) {
        // Reveal all letters
        const allLetters = new Set(gameState.revealedLetters);
        normalizedPhrase.split("").forEach(ch => {
          if (/[A-Z]/.test(ch)) allLetters.add(ch);
        });

        // Figure out which letters are new to trigger animation
        const newLetters = normalizedPhrase
          .split("")
          .filter(ch => /[A-Z]/.test(ch) && !gameState.revealedLetters.has(ch));
        const uniqueNewLetters = [...new Set(newLetters)];
        setNewlyRevealed(uniqueNewLetters);
        setTimeout(() => setNewlyRevealed([]), 2000);

        setGameState(prev => ({
          ...prev,
          revealedLetters: allLetters,
          message: `${currentPlayer.name} solved it!`,
        }));

        setTimeout(() => winRound(gameState.currentPlayerIndex), 1200);
      } else {
        playBuzzerSound();
        setGameState(prev => ({
          ...prev,
          turnPhase: "idle",
          message: `Wrong answer! The puzzle is not "${normalizedGuess}"`,
        }));
        setTimeout(nextPlayer, 1500);
      }
    },
    [
      gameState.phrase,
      gameState.revealedLetters,
      gameState.currentPlayerIndex,
      currentPlayer,
      nextPlayer,
      winRound,
      setGameState,
    ],
  );

  // Handle next player (manual)
  const handleNextPlayer = useCallback(() => {
    nextPlayer();
  }, [nextPlayer]);

  const canSpin = gameState.turnPhase === "idle" && !spinning;

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "#0A1628", overflow: "hidden" }}>
      {/* Session control bar */}
      <SessionControls
        isRoundInProgress={gameState.phase === "playing"}
        onNewGame={onNewGame}
        onFullReset={onFullReset}
        roundNumber={gameState.roundNumber}
      />

      {/* Main area */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Wheel (20%) */}
        <div className="flex flex-col items-center justify-center" style={{ width: "20%", padding: 16 }}>
          <Wheel
            onSpinComplete={handleSpinComplete}
            spinning={spinning}
            onSpinStart={handleSpinStart}
            disabled={!canSpin}
          />
        </div>

        {/* Center: Puzzle Board (50-60%) */}
        <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "32px 24px" }}>
          <PuzzleBoard
            phrase={gameState.phrase}
            revealedLetters={gameState.revealedLetters}
            category={gameState.category}
            newlyRevealed={newlyRevealed}
          />
        </div>

        {/* Right: Host Controls (20%) */}
        <div
          className="flex flex-col"
          style={{
            width: "22%",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <HostControls
            gameState={gameState}
            onLetterClick={handleLetterClick}
            onBuyVowelToggle={handleBuyVowelToggle}
            onSolve={handleSolve}
            onNextPlayer={handleNextPlayer}
            buyingVowel={buyingVowel}
            currentSpinResult={gameState.currentSpinResult}
            turnPhase={gameState.turnPhase}
          />
        </div>
      </div>

      {/* Bottom: Scoreboard */}
      <Scoreboard players={gameState.players} currentPlayerIndex={gameState.currentPlayerIndex} />
    </div>
  );
}
