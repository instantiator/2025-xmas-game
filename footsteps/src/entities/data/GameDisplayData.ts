import type { CSSProperties } from "react";

export type GameOverviewDisplayType = "game-overview-title" | "game-overview-stages";

export type GameChallengeDisplayType = "challenge-title" | "challenge-in-progress" | "challenge-completed";

export type GameStageDisplayType = "stage-overview";

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
  foregroundStyle?: CSSProperties;
}

export interface GameOverviewDisplay extends GameDisplayData {
  type: GameOverviewDisplayType;
  clickIdToStageId?: Record<string, string>;
}

export interface GameStageDisplay extends GameDisplayData {
  type: GameStageDisplayType;
  clickIdToChallengeId?: Record<string, string>;
}

export interface GameChallengeDisplay extends GameDisplayData {
  type: GameChallengeDisplayType;
}
