import { useState, useCallback } from "react";
import { SetupScreen } from "./components/game/SetupScreen";
import { RoundSetup } from "./components/game/RoundSetup";
import { GameScreen } from "./components/game/GameScreen";
import { RoundEnd } from "./components/game/RoundEnd";
import type { GameState } from "./components/game/types";
import { addFeedEvent } from "./components/game/types";

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
};

export const Home = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Start game with players
  const handleStartGame = useCallback((playerNames: string[]) => {
    const players = playerNames.map((name, i) => ({
      id: `player-${i}`,
      name,
      roundScore: 0,
      totalScore: 0,
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
        />
      )}
    </>
  );
};
