import type { GameStageData } from "../data/GameStageData";
import type { GameChallengeState } from "./GameChallengeState";

export interface GameStageState {
  stage: GameStageData;
  challengeStates: GameChallengeState[];
}
