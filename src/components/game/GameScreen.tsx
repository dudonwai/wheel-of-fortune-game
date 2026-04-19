import { useState, useCallback } from "react";
import { Wheel } from "./Wheel";
import { PuzzleBoard } from "./PuzzleBoard";
import { HostControls } from "./HostControls";
import { SessionControls } from "./SessionControls";
import { EventFeed } from "./EventFeed";
import { VOWELS, addFeedEvent, type GameState, type WheelResult } from "./types";
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
    setGameState(prev => {
      const nextIdx = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextName = prev.players[nextIdx].name;
      const msg = `${nextName}'s turn`;
      const feed = addFeedEvent(prev, "turnChange", `${nextName}'s turn`);
      return {
        ...prev,
        currentPlayerIndex: nextIdx,
        turnPhase: "idle",
        currentSpinResult: null,
        message: msg,
        ...feed,
      };
    });
  }, [setGameState]);

  // Win round
  const winRound = useCallback(
    (playerIndex: number) => {
      try {
        playApplauseSound();
      } catch {
        // Sound failure should never prevent score updates
      }
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
        const winMsg = `${updatedPlayers[playerIndex].name} wins the round!`;
        const feed = addFeedEvent(prev, "roundWin", winMsg);
        return {
          ...prev,
          players: updatedPlayers,
          phase: "roundEnd",
          roundWinner: updatedPlayers[playerIndex],
          message: winMsg,
          ...feed,
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
  // Note: spin start doesn't add a feed event — the result does

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
          const msg = `BANKRUPT! ${currentPlayer.name} loses all round earnings`;
          const feed = addFeedEvent(prev, "bankrupt", `${currentPlayer.name}: BANKRUPT! Lost all round earnings`);
          return {
            ...prev,
            players: updatedPlayers,
            turnPhase: "idle",
            currentSpinResult: result,
            message: msg,
            ...feed,
          };
        });
        setTimeout(nextPlayer, 1500);
        return;
      }

      if (result.type === "loseTurn") {
        playBuzzerSound();
        setGameState(prev => {
          const msg = `LOSE A TURN! ${currentPlayer.name}'s turn is over`;
          const feed = addFeedEvent(prev, "loseTurn", `${currentPlayer.name}: LOSE A TURN`);
          return {
            ...prev,
            turnPhase: "idle",
            currentSpinResult: result,
            message: msg,
            ...feed,
          };
        });
        setTimeout(nextPlayer, 1500);
        return;
      }

      // Money result — wait for consonant guess
      setGameState(prev => {
        const msg = `$${result.value}! ${currentPlayer.name}, pick a consonant`;
        const feed = addFeedEvent(prev, "spin", `${currentPlayer.name} spun $${result.value}`);
        return {
          ...prev,
          turnPhase: "guessing",
          currentSpinResult: result,
          currentWheelValue: result.value,
          message: msg,
          ...feed,
        };
      });
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

          const allRevealed = checkAllRevealed(newRevealed, gameState.phrase);

          setGameState(prev => {
            const updatedPlayers = prev.players.map((p, i) => {
              if (i === prev.currentPlayerIndex) {
                return { ...p, roundScore: p.roundScore - 250 };
              }
              return p;
            });
            const msg = `${upperLetter} is in the puzzle! (${count} time${count > 1 ? "s" : ""})`;
            const feed = addFeedEvent(prev, "buyVowel", `${currentPlayer.name} bought ${upperLetter} — ${count} found`);
            return {
              ...prev,
              players: updatedPlayers,
              revealedLetters: newRevealed,
              guessedLetters: newGuessed,
              turnPhase: allRevealed ? "roundComplete" : "idle",
              currentSpinResult: null,
              message: msg,
              ...feed,
            };
          });
          setBuyingVowel(false);

          // Check if all letters revealed
          if (allRevealed) {
            setTimeout(() => winRound(gameState.currentPlayerIndex), 5000);
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
            const msg = `No ${upperLetter} in the puzzle. Turn lost`;
            const feed = addFeedEvent(
              prev,
              "wrongGuess",
              `${currentPlayer.name} bought ${upperLetter} — not in puzzle`,
            );
            return {
              ...prev,
              players: updatedPlayers,
              guessedLetters: newGuessed,
              turnPhase: "idle",
              currentSpinResult: null,
              message: msg,
              ...feed,
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
          const allRevealed = checkAllRevealed(newRevealed, gameState.phrase);

          setGameState(prev => {
            const updatedPlayers = prev.players.map((p, i) => {
              if (i === prev.currentPlayerIndex) {
                return { ...p, roundScore: p.roundScore + earned };
              }
              return p;
            });
            const msg = `${count} ${upperLetter}${count > 1 ? "'s" : ""}! +$${earned.toLocaleString()}`;
            const feed = addFeedEvent(
              prev,
              "correctGuess",
              `${currentPlayer.name} guessed ${upperLetter} — ${count} found, +$${earned.toLocaleString()}`,
            );
            return {
              ...prev,
              players: updatedPlayers,
              revealedLetters: newRevealed,
              guessedLetters: newGuessed,
              turnPhase: allRevealed ? "roundComplete" : "idle",
              currentSpinResult: null,
              message: msg,
              ...feed,
            };
          });

          // Check if all letters revealed
          if (allRevealed) {
            setTimeout(() => winRound(gameState.currentPlayerIndex), 5000);
          }
        } else {
          playBuzzerSound();
          setGameState(prev => {
            const msg = `No ${upperLetter} in the puzzle`;
            const feed = addFeedEvent(
              prev,
              "wrongGuess",
              `${currentPlayer.name} guessed ${upperLetter} — not in puzzle`,
            );
            return {
              ...prev,
              guessedLetters: newGuessed,
              turnPhase: "idle",
              currentSpinResult: null,
              message: msg,
              ...feed,
            };
          });
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
      currentPlayer.name,
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
  // Note: buy vowel toggle doesn't add a feed event — the vowel pick result does

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

        // Immediately mark the round as complete to disable all host controls
        setGameState(prev => {
          const msg = `${currentPlayer.name} solved it!`;
          const feed = addFeedEvent(prev, "solve", `${currentPlayer.name} solved the puzzle!`);
          return {
            ...prev,
            revealedLetters: allLetters,
            turnPhase: "roundComplete",
            message: msg,
            ...feed,
          };
        });

        setTimeout(() => winRound(gameState.currentPlayerIndex), 5000);
      } else {
        playBuzzerSound();
        setGameState(prev => {
          const msg = `Wrong answer! The puzzle is not "${normalizedGuess}"`;
          const feed = addFeedEvent(prev, "wrongSolve", `${currentPlayer.name} guessed "${normalizedGuess}" — wrong!`);
          return {
            ...prev,
            turnPhase: "idle",
            message: msg,
            ...feed,
          };
        });
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
        players={gameState.players}
        currentPlayerIndex={gameState.currentPlayerIndex}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Left panel: Scores + Spin button + Host Controls (~20%) */}
        <div
          className="flex flex-col min-h-0 w-full md:w-[20%] order-2 md:order-1 border-b md:border-b-0 md:border-r border-white/10 shrink-0 md:shrink"
          style={{
            minWidth: 220,
          }}
        >
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Spin the Wheel button — colored by current player */}
            <div style={{ flexShrink: 0, padding: "12px 12px 8px" }}>
              <button
                onClick={handleSpinStart}
                disabled={!canSpin || spinning}
                className="w-full py-3 px-4 rounded font-bold text-base uppercase tracking-wider transition-all"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  backgroundColor: !canSpin || spinning ? "#333" : currentPlayer.color,
                  color: !canSpin || spinning ? "#666" : "#FFFFFF",
                  cursor: !canSpin || spinning ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                  fontSize: 16,
                  transition: "background-color 0.3s ease",
                }}
              >
                {spinning ? "Spinning..." : `Spin the Wheel`}
              </button>
            </div>

            {/* Host Controls (Letter board + action buttons) */}
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

        {/* Middle: Wheel + Puzzle Board */}
        <div className="flex-1 flex flex-col items-center order-1 md:order-2 shrink-0 md:shrink overflow-y-auto" style={{ padding: "16px 24px", minWidth: 0 }}>
          {/* Wheel */}
          <div
            className="flex items-center justify-center shrink-0 w-full max-w-[600px] min-h-[350px] md:min-h-[450px]"
            style={{ padding: "0 0 24px" }}
          >
            <Wheel
              onSpinComplete={handleSpinComplete}
              spinning={spinning}
              onSpinStart={handleSpinStart}
              disabled={!canSpin}
              size={600}
              hideButton
            />
          </div>
          {/* Puzzle Board */}
          <div className="flex flex-col items-center justify-center w-full pb-8 shrink-0">
            <PuzzleBoard
              phrase={gameState.phrase}
              revealedLetters={gameState.revealedLetters}
              category={gameState.category}
              newlyRevealed={newlyRevealed}
            />
          </div>
        </div>

        {/* Right panel: Event Feed (~20%) */}
        <div
          className="flex flex-col min-h-0 w-full md:w-[20%] order-3 border-t md:border-t-0 md:border-l border-white/10 shrink-0 md:shrink"
          style={{
            minWidth: 220,
          }}
        >
          <div className="flex-1 flex flex-col min-h-0" style={{ padding: "12px" }}>
            <div className="flex-1 min-h-0">
              <EventFeed events={gameState.feedEvents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
