import { NO_CHALLENGE_TEMPLATE, NO_OVERVIEW_GAME_TEMPLATE } from "../../../constants/DefaultGameDisplays";
import type { GameChallengeData } from "../../../entities/data/GameChallengeData";
import type { GameData, GameId } from "../../../entities/data/GameData";
import type {
  GameChallengeDisplay,
  GameChallengeDisplayType,
  GameDisplayTemplate,
  GameOverviewDisplay,
  GameOverviewDisplayType,
} from "../../../entities/data/GameDisplayData";
import type { GameChallengeState } from "../../../entities/state/GameChallengeState";
import type { GameState } from "../../../entities/state/GameState";
import { isDefined } from "../../../util/ObjectUtils";

/**
 * A union type of all template data types.
 */
export type GameTemplateData = GameOverviewTemplateData | GameChallengeTemplateData;

/**
 * Information required to render a game overview with GameTemplates.
 */
export interface GameOverviewRenderData {
  overviewDisplay: GameOverviewDisplay;
  backgroundTemplate: GameDisplayTemplate;
  foregroundTemplate: GameDisplayTemplate;
  backgroundStyle: React.CSSProperties | undefined;
  foregroundStyle: React.CSSProperties | undefined;
  templateData: GameOverviewTemplateData;
}

/**
 * Data to provide to game overview Mustache templates.
 */
export interface GameOverviewTemplateData {
  gameId: GameId;
  gameData: GameData;
  gameState: GameState;
}

/**
 * Information required to render a game challenge with GameTemplates.
 */
export interface GameChallengeRenderData {
  challengeKey: string;
  challengeDisplay: GameChallengeDisplay;
  backgroundTemplate: GameDisplayTemplate;
  foregroundTemplate: GameDisplayTemplate;
  backgroundStyle: React.CSSProperties | undefined;
  foregroundStyle: React.CSSProperties | undefined;
  templateData: GameChallengeTemplateData;
}

/**
 * Data to provide to game challenge Mustache templates.
 */
export interface GameChallengeTemplateData {
  gameId: GameId;
  gameData: GameData;
  gameState: GameState;
  challenge: GameChallengeData;
  challengeData: Record<string, any>;
  challengeState: GameChallengeState;
}

/**
 * Selects the appropriate display for the game overview, based on the current display type.
 */
export const selectOverviewDisplay = (
  overviewDisplayType: GameOverviewDisplayType | null,
  gameData: GameData,
): GameOverviewDisplay | undefined =>
  isDefined(overviewDisplayType)
    ? gameData.displays.find((d) => d.type === overviewDisplayType)
    : (gameData.displays.find((d) => d.type === "game-overview-title") ??
      gameData.displays.find((d) => d.type === "game-overview-stages"));

/**
 * Generates GameOverviewRenderData for the current game overview.
 * @param gameState the current game state
 * @param gameData the game data
 * @returns a GamerOverviewRenderData for the current overview.
 */
export const generateOverviewRenderData = (
  gameId: GameId,
  gameData: GameData,
  gameState: GameState,
): GameOverviewRenderData => {
  const overviewDisplay = selectOverviewDisplay(gameState.current.overviewDisplay, gameData);

  if (!isDefined(overviewDisplay)) {
    throw new Error("No overview display found for game.");
  }

  const backgroundTemplate = overviewDisplay.backgroundTemplate ?? NO_OVERVIEW_GAME_TEMPLATE;
  const foregroundTemplate = overviewDisplay.foregroundTemplate ?? NO_OVERVIEW_GAME_TEMPLATE;
  const backgroundStyle = overviewDisplay.backgroundStyle;
  const foregroundStyle = overviewDisplay.foregroundStyle;
  const templateData: GameOverviewTemplateData = {
    gameId,
    gameData,
    gameState,
  };

  return {
    overviewDisplay,
    backgroundTemplate,
    foregroundTemplate,
    backgroundStyle,
    foregroundStyle,
    templateData,
  };
};

/**
 * Selects the appropriate display for a challenge, based on the current display type,
 * or falling back to defaults if none is specified.
 * @param challengeDisplayType the current display type
 * @param challenge challenge data
 * @returns a GameChallengeDisplay, or undefined if not possible to determine
 */
export const selectChallengeDisplay = (
  challengeDisplayType: GameChallengeDisplayType | null,
  challenge: GameChallengeData,
): GameChallengeDisplay | undefined =>
  isDefined(challengeDisplayType)
    ? challenge.displays.find((d) => d.type === challengeDisplayType)
    : (challenge.displays.find((d) => d.type === "challenge-title") ??
      challenge.displays.find((d) => d.type === "challenge-in-progress") ??
      challenge.displays.find((d) => d.type === "challenge-completed"));

/**
 * Generates GameChallengeRenderData for the given challenge states.
 * This includes picking the appropriate display and preparing template data.
 * This can be used to render a game challenge with GameTemplates.
 *
 * @param gameId id of the game
 * @param gameData game data
 * @param gameState game state
 * @param challengeStates the challenge states to generate render data for
 * @returns a GameChallengeRenderData[] for the given challenges
 */
export const generateChallengesRenderData = (
  gameId: GameId,
  gameData: GameData,
  gameState: GameState,
  challengeStates: GameChallengeState[],
): GameChallengeRenderData[] =>
  challengeStates.map((challengeState) => {
    const challengeDisplayType = challengeState.challengeDisplay;
    const challengeDisplay = selectChallengeDisplay(challengeDisplayType, challengeState.challenge);

    if (!isDefined(challengeDisplay)) {
      throw new Error(`No ${challengeDisplayType} display found for challenge.`);
    }

    const backgroundTemplate = challengeDisplay?.backgroundTemplate ?? NO_CHALLENGE_TEMPLATE(challengeDisplay.type);
    const foregroundTemplate = challengeDisplay?.foregroundTemplate ?? NO_CHALLENGE_TEMPLATE(challengeDisplay.type);
    const backgroundStyle = challengeDisplay?.backgroundStyle;
    const foregroundStyle = challengeDisplay?.foregroundStyle;
    const templateData: GameChallengeTemplateData = {
      gameId,
      gameData,
      gameState,
      challenge: challengeState.challenge,
      challengeData: challengeDisplay.data,
      challengeState: challengeState,
    };
    const challengeKey = `${gameId}-${gameState.current.stageId}-${challengeState.challenge.id}`;
    return {
      challengeKey,
      challengeDisplay,
      backgroundStyle,
      foregroundStyle,
      backgroundTemplate,
      foregroundTemplate,
      templateData,
    };
  });
