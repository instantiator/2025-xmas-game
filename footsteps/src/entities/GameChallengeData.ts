import type { ChallengeGameDisplay } from "./GameDisplayData";

export type GameChallengeId = string;
export type GameChallengeSolution = string;

export interface GameChallengeData {
  id: GameChallengeId;
  displays: ChallengeGameDisplay[];
  solution: GameChallengeSolution;
}
