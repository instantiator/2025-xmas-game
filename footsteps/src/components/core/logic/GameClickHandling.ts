import type { GameOverviewDisplayType } from "../../../entities/data/GameDisplayData";
import type { GameState } from "../../../entities/state/GameState";
import { isDefined } from "../../../util/ObjectUtils";
import { selectOverviewDisplay } from "./GameDisplayRenderDataGeneration";

export const GameOverviewSequence: GameOverviewDisplayType[] = ["game-overview-title", "game-overview-stages"];

// @ts-expect-error: layerId and targetId will be used in future

export const getNewGameStateForClick = (state: GameState, layerId: string, targetId: string): GameState | undefined => {
  if (!isDefined(state.current.stageId)) {
    const currentOverviewDisplay = selectOverviewDisplay(state.current.overviewDisplay, state.game);
    if (isDefined(currentOverviewDisplay)) {
      if (isDefined(currentOverviewDisplay.clickIdToStageId)) {
        const stageId = currentOverviewDisplay.clickIdToStageId[targetId];
        if (isDefined(stageId)) {
          return {
            ...state,
            current: {
              ...state.current,
              stageId: stageId,
            },
          };
        }
      }

      if (currentOverviewDisplay.type === "game-overview-title") {
        // the title screen was clicked - any click moves to the challenges overview
        return {
          ...state,
          current: {
            ...state.current,
            overviewDisplay: "game-overview-stages",
          },
        };
      }
    }
  }

  // no state changes required
  return undefined;
};
