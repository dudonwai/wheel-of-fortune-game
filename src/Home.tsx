import { useState, useCallback } from "react";
import { SetupScreen } from "./components/game/SetupScreen";
import { RoundSetup } from "./components/game/RoundSetup";
import { GameScreen } from "./components/game/GameScreen";
import { RoundEnd } from "./components/game/RoundEnd";
import { FinalRoundSetup } from "./components/game/FinalRoundSetup";
import { FinalRoundScreen } from "./components/game/FinalRoundScreen";
import type { GameState } from "./components/game/types";
import { addFeedEvent, PLAYER_COLORS, FINAL_ROUND_FREE_LETTERS } from "./components/game/types";

const initialGameState: GameState = {
  phase: "setup",
  turnPhase: "idle",
  players: [],
  currentPlayerIndex: 0,
  phrase: "",
  category: "",
  revealedLetters: new Set(),
  guessedLetters: new Set(),
  currentWheelValue: 0,
  currentSpinResult: null,
  roundNumber: 1,
  roundWinner: null,
  message: "",
  feedEvents: [],
  feedCounter: 0,
  finalRound: null,
};

export const Home = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Start game with players
  const handleStartGame = useCallback((playerNames: string[]) => {
    const players = playerNames.map((name, i) => ({
      id: `player-${i}`,
      name: name.toUpperCase(),
      roundScore: 0,
      totalScore: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    }));
    setGameState({
      ...initialGameState,
      phase: "roundSetup",
      players,
      message: `${players[0].name}'s turn`,
      feedEvents: [],
      feedCounter: 0,
    });
  }, []);

  // Start a new round
  const handleStartRound = useCallback((phrase: string, category: string) => {
    setGameState(prev => {
      const msg = `${prev.players[prev.currentPlayerIndex].name}'s turn — spin the wheel!`;
      const feed = addFeedEvent(
        { feedEvents: [], feedCounter: 0 },
        "info",
        `Round ${prev.roundNumber} started — "${category}"`,
      );
      return {
        ...prev,
        phase: "playing",
        turnPhase: "idle",
        phrase,
        category,
        revealedLetters: new Set(),
        guessedLetters: new Set(),
        currentWheelValue: 0,
        currentSpinResult: null,
        roundWinner: null,
        players: prev.players.map(p => ({ ...p, roundScore: 0 })),
        message: msg,
        feedEvents: feed.feedEvents,
        feedCounter: feed.feedCounter,
      };
    });
  }, []);

  // Start new round after round end
  const handleNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: "roundSetup",
      roundNumber: prev.roundNumber + 1,
      currentPlayerIndex: 0,
      turnPhase: "idle",
    }));
  }, []);

  // New game mid-round: discard current round scores, keep session totals, go to round setup
  const handleNewGameMidRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: "roundSetup",
      turnPhase: "idle",
      roundNumber: prev.roundNumber + 1,
      currentPlayerIndex: 0,
      phrase: "",
      category: "",
      revealedLetters: new Set(),
      guessedLetters: new Set(),
      currentWheelValue: 0,
      currentSpinResult: null,
      roundWinner: null,
      players: prev.players.map(p => ({ ...p, roundScore: 0 })),
      message: "",
      feedEvents: [],
      feedCounter: 0,
    }));
  }, []);

  // Go to final round setup
  const handleFinalRound = useCallback(() => {
    setGameState(prev => {
      // Find the player with the highest total score
      const sorted = [...prev.players].sort((a, b) => b.totalScore - a.totalScore);
      const finalist = sorted[0];
      return {
        ...prev,
        phase: "finalRoundSetup" as const,
        finalRound: {
          finalist,
          consonantPicks: 3,
          vowelPicks: 1,
          phase: "picking" as const,
          solved: null,
        },
      };
    });
  }, []);

  // Start the final round gameplay
  const handleStartFinalRound = useCallback((phrase: string, category: string) => {
    setGameState(prev => {
      if (!prev.finalRound) return prev;

      // Pre-reveal R, S, T, L, N, E
      const revealedLetters = new Set<string>();
      const phraseUpper = phrase.toUpperCase();
      FINAL_ROUND_FREE_LETTERS.forEach(letter => {
        if (phraseUpper.includes(letter)) {
          revealedLetters.add(letter);
        }
      });

      // Mark free letters as guessed so they show as used on the letter board
      const guessedLetters = new Set<string>(FINAL_ROUND_FREE_LETTERS);

      return {
        ...prev,
        phase: "finalRound" as const,
        phrase,
        category,
        revealedLetters,
        guessedLetters,
        message: `${prev.finalRound.finalist.name}, pick 3 consonants and 1 vowel`,
        finalRound: {
          ...prev.finalRound,
          consonantPicks: 3,
          vowelPicks: 1,
          phase: "picking" as const,
          solved: null,
        },
      };
    });
  }, []);

  // Cancel final round setup — go back to round end
  const handleCancelFinalRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: "roundEnd" as const,
      finalRound: null,
    }));
  }, []);

  // Full reset: go all the way back to setup screen
  const handleFullReset = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulseGold {
          0%, 100% { border-bottom-color: #F5C518; }
          50% { border-bottom-color: rgba(245, 197, 24, 0.3); }
        }
      `}</style>

      {gameState.phase === "setup" && <SetupScreen onStartGame={handleStartGame} />}

      {gameState.phase === "roundSetup" && (
        <RoundSetup
          roundNumber={gameState.roundNumber}
          onStartRound={handleStartRound}
          onFullReset={handleFullReset}
          players={gameState.players}
        />
      )}

      {gameState.phase === "playing" && (
        <GameScreen
          gameState={gameState}
          setGameState={setGameState}
          onNewGame={handleNewGameMidRound}
          onFullReset={handleFullReset}
        />
      )}

      {gameState.phase === "roundEnd" && (
        <RoundEnd
          winner={gameState.roundWinner}
          phrase={gameState.phrase}
          players={gameState.players}
          onNewRound={handleNewRound}
          onEndGame={handleFullReset}
          onFinalRound={handleFinalRound}
        />
      )}

      {gameState.phase === "finalRoundSetup" && gameState.finalRound && (
        <FinalRoundSetup
          finalist={gameState.finalRound.finalist}
          onStartFinalRound={handleStartFinalRound}
          onCancel={handleCancelFinalRound}
        />
      )}

      {gameState.phase === "finalRound" && gameState.finalRound && (
        <FinalRoundScreen gameState={gameState} setGameState={setGameState} onEndGame={handleFullReset} />
      )}
    </>
  );
};
