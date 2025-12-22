import type { GameChallengeData } from "../data/GameChallengeData";
import type { GameChallengeAnswer } from "../data/GameChallengeSolution";
import type { GameChallengeDisplayType } from "../data/GameDisplayData";

export interface GameChallengeState {
  challenge: GameChallengeData;
  challengeDisplay: GameChallengeDisplayType | null;
  attempts: GameChallengeAnswer[];
  succeeded: boolean;
}
