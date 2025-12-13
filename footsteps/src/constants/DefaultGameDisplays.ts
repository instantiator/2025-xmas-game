import type { ChallengeGameDisplayType, GameDisplayTemplate } from "../entities/GameDisplayData";

export const NO_OVERVIEW_GAME_TEMPLATE: GameDisplayTemplate = {
  sourceType: "embedded",
  content: "<h1>No overview defined</h1>",
};

export const NO_CHALLENGE_TEMPLATE = (type: ChallengeGameDisplayType): GameDisplayTemplate => ({
  sourceType: "embedded",
  content: `<h1>No challenge display defined</h1><h2>Type: ${type}</h2>`,
});
