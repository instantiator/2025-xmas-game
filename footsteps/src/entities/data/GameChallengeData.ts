import type { GameChallengeSolution } from "./GameChallengeSolution";
import type { GameChallengeDisplay, GameChallengeDisplayType } from "./GameDisplayData";

export type GameChallengeId = string;

/** Describes an individual challenge in the game */
export interface GameChallengeData {
  /** Unique id for this challenge */
  id: GameChallengeId;

  /** Displays associated with this challenge */
  displays: { [T in GameChallengeDisplayType]: GameChallengeDisplay | undefined };

  /** The solution for this challenge */
  solution: GameChallengeSolution;
}
