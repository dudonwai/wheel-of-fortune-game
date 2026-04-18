// Wheel of Fortune game types

export interface Player {
  id: string;
  name: string;
  roundScore: number;
  totalScore: number;
}

export type WheelResult = { type: "money"; value: number } | { type: "bankrupt" } | { type: "loseTurn" };

export const WHEEL_SEGMENTS: WheelResult[] = [
  { type: "money", value: 500 },
  { type: "bankrupt" },
  { type: "money", value: 900 },
  { type: "money", value: 400 },
  { type: "money", value: 300 },
  { type: "money", value: 2000 },
  { type: "money", value: 600 },
  { type: "loseTurn" },
  { type: "money", value: 200 },
  { type: "money", value: 800 },
  { type: "money", value: 5000 },
  { type: "money", value: 100 },
  { type: "money", value: 700 },
  { type: "bankrupt" },
  { type: "money", value: 1000 },
  { type: "money", value: 300 },
];

export const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export type GamePhase = "setup" | "roundSetup" | "playing" | "roundEnd" | "gameEnd";

export type TurnPhase = "idle" | "spinning" | "spinResult" | "guessing" | "buyingVowel" | "solving";

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  players: Player[];
  currentPlayerIndex: number;
  phrase: string;
  category: string;
  revealedLetters: Set<string>;
  guessedLetters: Set<string>;
  currentWheelValue: number;
  currentSpinResult: WheelResult | null;
  roundNumber: number;
  roundWinner: Player | null;
  message: string;
}

export function getSegmentLabel(segment: WheelResult): string {
  if (segment.type === "money") return `$${segment.value}`;
  if (segment.type === "bankrupt") return "BANKRUPT";
  return "LOSE A TURN";
}

export function getSegmentColor(segment: WheelResult): string {
  if (segment.type === "bankrupt") return "#111111";
  if (segment.type === "loseTurn") return "#EEEEEE";
  if (segment.value >= 5000) return "#FFD700";
  if (segment.value >= 2000) return "#E8339E";
  if (segment.value >= 1000) return "#FF6B35";
  if (segment.value >= 800) return "#3B82F6";
  if (segment.value >= 600) return "#8B5CF6";
  if (segment.value >= 500) return "#059669";
  if (segment.value >= 400) return "#DC2626";
  if (segment.value >= 300) return "#D97706";
  if (segment.value >= 200) return "#0891B2";
  return "#6366F1";
}

export function getSegmentTextColor(segment: WheelResult): string {
  if (segment.type === "loseTurn") return "#111111";
  return "#FFFFFF";
}
