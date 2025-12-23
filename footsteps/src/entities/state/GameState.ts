import { selectOverviewDisplay } from "../../components/core/logic/GameDisplayRenderDataGeneration";
import type { GameData } from "../data/GameData";
import type { GameOverviewDisplayType } from "../data/GameDisplayData";
import type { GameStageId } from "../data/GameStageData";
import type { GameStageState } from "./GameStageState";

export interface GameState {
  game: GameData;
  stages: GameStageState[];
  current: {
    stageId: GameStageId | null;
    overviewDisplay: GameOverviewDisplayType | null;
  };
}

export function createBlankGameState(game: GameData): GameState {
  const stages: GameStageState[] = game.stages.map((stage) => ({
    stage: stage,
    challengeStates: stage.challenges.map((challenge) => ({
      challenge: challenge,
      challengeDisplay: null,
      attempts: [],
      succeeded: false,
    })),
  }));

  return {
    game,
    stages: stages,
    current: { stageId: null, overviewDisplay: selectOverviewDisplay(null, game)?.type ?? "game-overview-title" },
  };
}
