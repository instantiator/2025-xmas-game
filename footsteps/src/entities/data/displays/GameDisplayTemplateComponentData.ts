import type { CSSProperties } from "react";
import type { GameDisplayComponentBase } from "./GameDisplayData";

export type TemplateSourceType = "relative" | "url" | "embedded";

export interface GameDisplayTemplateComponentData extends GameDisplayComponentBase {
  type: "template";
  backgroundTemplate?: GameDisplayTemplate;
  foregroundTemplate?: GameDisplayTemplate;
  backgroundStyle?: CSSProperties;
  foregroundStyle?: CSSProperties;
}

export interface GameDisplayTemplate {
  sourceType: TemplateSourceType;
  templateSource?: string;
  content?: string;
}
