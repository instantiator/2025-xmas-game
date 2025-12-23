import type { GameDisplayComponentBase } from "./GameDisplayData";
import type { GameDisplayTemplate } from "./GameDisplayTemplateComponentData";

export interface GameDisplayScrollComponentData extends GameDisplayComponentBase {
  type: "scroll";
  backgroundTemplate?: GameDisplayTemplate;
  foregroundTemplate?: GameDisplayTemplate;
  backgroundStyle?: React.CSSProperties;
  foregroundStyle?: React.CSSProperties;
  text?: string;
  showInput?: boolean;
  hint?: string;
  label?: string;
}
