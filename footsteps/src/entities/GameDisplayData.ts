export type GameDisplayType =
  | "GameOverview"
  | "ChallengePreview"
  | "ChallengeIntroduction"
  | "ChallengeSolutionEntry"
  | "ChallengeCompleted";

export type TemplateSourceType = "relative" | "url" | "embedded";

export interface GameDisplayTemplate {
  sourceType: TemplateSourceType;
  templateSource: string;
  content?: string;
}

export interface GameDisplayData {
  type: GameDisplayType;
  template: GameDisplayTemplate;
  data: Record<string, unknown>;
}

export interface OverviewGameDisplay extends GameDisplayData {
  type: "GameOverview";
}
