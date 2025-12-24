import type { GameDisplayComponentBase } from "./GameDisplayData";
import type { GameDisplayTemplateSourceData } from "./GameDisplayTemplateComponentData";

export interface GameDisplayScrollComponentData extends GameDisplayComponentBase {
  type: "scroll";
  backgroundTemplate?: GameDisplayTemplateSourceData;
  foregroundTemplate?: GameDisplayTemplateSourceData;
  backgroundStyle?: React.CSSProperties;
  foregroundStyle?: React.CSSProperties;
  text?: string;
  showInput?: boolean;
  hint?: string;
  label?: string;
}
