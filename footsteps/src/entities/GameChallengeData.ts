import type { GameDisplayData } from "./GameDisplayData";

export type GameChallengeId = string;
export type GameChallengeSolution = string;

export interface GameChallengeData {
  id: GameChallengeId;
  displays: GameDisplayData[];
  solution: GameChallengeSolution;
}
