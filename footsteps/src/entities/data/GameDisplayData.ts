import type { CSSProperties } from "react";

export type GameOverviewDisplayType = "game-overview-title" | "game-overview-challenges";

export type GameChallengeDisplayType = "challenge-title" | "challenge-in-progress" | "challenge-completed";

export type GameStageDisplayType = "stage-layout";

export type GameDisplayType = GameOverviewDisplayType | GameChallengeDisplayType | GameStageDisplayType;

export type TemplateSourceType = "relative" | "url" | "embedded";

export interface GameDisplayTemplate {
  sourceType: TemplateSourceType;
  templateSource?: string;
  content?: string;
}

export interface GameDisplayData {
  type: GameDisplayType;
  backgroundTemplate?: GameDisplayTemplate;
  foregroundTemplate?: GameDisplayTemplate;
  data: Record<string, unknown>;
  backgroundStyle?: CSSProperties;
}

export interface GameOverviewDisplay extends GameDisplayData {
  type: GameOverviewDisplayType;
}

export interface GameStageDisplay extends GameDisplayData {
  type: GameStageDisplayType;
}

export interface GameChallengeDisplay extends GameDisplayData {
  type: GameChallengeDisplayType;
}
