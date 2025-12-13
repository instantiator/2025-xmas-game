import type { ChallengeGameDisplay, ChallengeGameDisplayType, OverviewGameDisplay } from "../entities/GameDisplayData";

export const NO_OVERVIEW_GAME_DISPLAY: OverviewGameDisplay = {
  type: "game-overview",
  foregroundTemplate: {
    sourceType: "embedded",
    content: "<h1>No overview defined</h1>",
  },
  data: {},
};

export const NO_CHALLENGE_DISPLAY = (type: ChallengeGameDisplayType): ChallengeGameDisplay => ({
  type,
  foregroundTemplate: {
    sourceType: "embedded",
    content: "<h1>No challenge display defined</h1><h2>Type: {{type}}</h2>",
  },
  data: {},
});
