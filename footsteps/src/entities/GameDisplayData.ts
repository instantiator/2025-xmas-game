import type { CSSProperties } from "react";

export type OverviewGameDisplayType = "game-overview";

export type ChallengeGameDisplayType = "challenge-in-progress" | "challenge-completed";

export type GameDisplayType = OverviewGameDisplayType | ChallengeGameDisplayType;

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

export interface OverviewGameDisplay extends GameDisplayData {
  type: OverviewGameDisplayType;
}

export interface ChallengeGameDisplay extends GameDisplayData {
  type: ChallengeGameDisplayType;
}
