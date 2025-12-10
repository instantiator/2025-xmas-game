export type GameDisplayType =
  | "GameOverview"
  | "ChallengePreview"
  | "ChallengeIntroduction"
  | "ChallengeSolutionEntry"
  | "ChallengeCompleted";

export interface GameDisplayData {
  type: GameDisplayType;
  template: string;
  data: Record<string, unknown>;
}

export interface OverviewGameDisplay extends GameDisplayData {
  type: "GameOverview";
};
