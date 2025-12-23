import _ from "lodash";
import type { GameChallengeData } from "../../../entities/data/GameChallengeData";
import type {
  GameChallengeDisplay,
  GameDisplayBase,
  GameOverviewDisplay,
} from "../../../entities/data/displays/GameDisplayData";
import type { GameChallengeState } from "../../../entities/state/GameChallengeState";
import type { GameStageState } from "../../../entities/state/GameStageState";
import type { GameState } from "../../../entities/state/GameState";
import { isDefined } from "../../../util/ObjectUtils";

export type GameDisplayMode = "overview" | "stage";

export interface GameDisplayRenderData extends GameDisplayBase {
  templateData: GameTemplateData;
}

/**
 * Data to provide to game challenge Mustache templates.
 */
export interface GameTemplateData {
  gameState: GameState;
  componentData: Record<string, any>;
  resources: Record<string, any>;
  challenge?: GameChallengeData;
  challengeState?: GameChallengeState;
}

export const getRenderMode = (gameState: GameState): GameDisplayMode =>
  isDefined(gameState.current.stageId) ? "stage" : "overview";

/**
 * Generates information describing what to render from the game state
 * @param gameState the current game state
 * @returns a GameDisplayRenderData[] with components to render
 */
export const getRenderData = (gameState: GameState, resources: Record<string, string>): GameDisplayRenderData[] => {
  const mode = getRenderMode(gameState);
  const { stage, activeChallengeStates } = getCurrentStageState(gameState);

  switch (mode) {
    case "overview": {
      const overviewDisplay = getOverviewDisplay(gameState);
      if (isDefined(overviewDisplay)) {
        const overviewTemplateData: GameTemplateData = {
          gameState,
          resources: resources ?? {},
          componentData: overviewDisplay.component.data,
        };
        return [
          {
            purpose: overviewDisplay.purpose,
            component: overviewDisplay.component,
            templateData: overviewTemplateData,
          },
        ];
      } else {
        throw new Error("No overview display found for game.");
      }
    }
    case "stage": {
      if (isDefined(stage)) {
        if (isDefined(activeChallengeStates)) {
          return activeChallengeStates.map((challengeState) => {
            const challengeDisplay = getChallengeDisplay(challengeState);
            if (isDefined(challengeDisplay)) {
              const challengeTemplateData: GameTemplateData = {
                gameState,
                resources: resources ?? {},
                challenge: challengeState.challenge,
                challengeState: challengeState,
                componentData: challengeDisplay.component.data,
              };
              return {
                purpose: challengeDisplay.purpose,
                component: challengeDisplay.component,
                templateData: challengeTemplateData,
              };
            } else {
              throw new Error(`No display for challenge ${challengeState.challenge.id} in stage ${stage?.stage.id}.`);
            }
          });
        } else {
          throw new Error(`No active challenges found for stage ${stage.stage.id}.`);
        }
      } else {
        throw new Error("No current stage found in game state.");
      }
    }
  }
};

/**
 * Selects the appropriate display for the game overview, based on the current display type.
 */
export const getOverviewDisplay = (gameState: GameState): GameOverviewDisplay | undefined =>
  isDefined(gameState.current.overviewDisplay)
    ? gameState.gameData.displays.find((d) => d.purpose === gameState.current.overviewDisplay)
    : (gameState.gameData.displays.find((d) => d.purpose === "game-overview-title") ??
      gameState.gameData.displays.find((d) => d.purpose === "game-overview-stages"));

/**
 * Gets the challenge displays for the given challenge states.
 * @param challengeStates a set of challenge states
 */
export const getChallengeDisplays = (challengeStates: GameChallengeState[]) =>
  challengeStates?.map((challengeState) => getChallengeDisplay(challengeState)) ?? [];

/**
 * Gets the challenge display for the given challenge state.
 * @param challengeState the state of the challenge to get the display for
 * @returns a GameChallengeDisplay if one can be determined, or undefined if not
 */
export const getChallengeDisplay = (challengeState: GameChallengeState): GameChallengeDisplay | undefined =>
  isDefined(challengeState.displayPurpose)
    ? challengeState.challenge.displays.find((d) => d.purpose === challengeState.displayPurpose)
    : (challengeState.challenge.displays.find((d) => d.purpose === "challenge-title") ??
      challengeState.challenge.displays.find((d) => d.purpose === "challenge-in-progress") ??
      challengeState.challenge.displays.find((d) => d.purpose === "challenge-completed"));

/**
 * Retrieves the current stage state and its active challenges from the game state.
 * @param gameState the current game state
 * @returns the current stage state and the first chunk of challenges with any still active, or nulls if no current stage is set.
 */
export const getCurrentStageState = (
  gameState: GameState,
): { stage: GameStageState | null; activeChallengeStates: GameChallengeState[] | null } => {
  if (!isDefined(gameState.current.stageId)) {
    return { stage: null, activeChallengeStates: null };
  }
  const stageState = gameState.stages.find((s) => s.stage.id === gameState.current.stageId);
  const stage = stageState?.stage;
  const chunking = stage?.challengeChunking ?? 1;
  const chunkedChallengeStates = _.chunk(stageState?.challengeStates ?? [], chunking);
  const currentChallengeStates = chunkedChallengeStates.find((chunk) => !chunk.some((c) => c.succeeded));
  return { stage: stageState ?? null, activeChallengeStates: currentChallengeStates ?? null };
};
