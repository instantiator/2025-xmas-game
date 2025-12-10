import type { GameChallengeData, GameChallengeSolution } from "./GameChallengeData";

export interface GameChallengeState {
    challenge: GameChallengeData;
    attempts: GameChallengeSolution[];
    succeeded: boolean;
}