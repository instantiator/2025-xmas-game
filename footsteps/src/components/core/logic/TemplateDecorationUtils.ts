import type { GameStageState } from "../../../entities/state/GameStageState";
import type { GameState } from "../../../entities/state/GameState";

export type DecoratedGameState = GameState & {
  stages: DecoratedStageState[];
  totalStages: number;
};

export type DecoratedStageState = GameStageState & {
  index: number;
  oneIndex: number;
  showCompleted: boolean;
  showUnlocked: boolean;
  showLocked: boolean;
};

export const decorateGameState = (gameState: GameState): DecoratedGameState => ({
  ...gameState,
  stages: gameState.stages.map((stageState, index) => ({
    ...stageState,
    index,
    oneIndex: index + 1,
    showCompleted: stageState.completion === "completed",
    showUnlocked: stageState.completion !== "completed" && stageState.availability === "unlocked",
    showLocked: stageState.availability === "locked",
  })),
  totalStages: gameState.stages.length,
});
