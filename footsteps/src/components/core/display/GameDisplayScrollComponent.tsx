import type { CSSProperties } from "react";
import type { GameDisplayScrollComponentData } from "../../../entities/data/displays/GameDisplayScrollComponentData";
import type { GameDisplayTemplate } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import type { LayerHint } from "./GameDisplayComponent";
import GameDisplayTemplateComponent from "./GameDisplayTemplateComponent";

interface GameDisplayScrollComponentProps {
  templateSource?: GameDisplayTemplate;
  containerStyle?: React.CSSProperties;
  templateData?: Record<string, any>;
  scrollData: GameDisplayScrollComponentData;
  layerHint: LayerHint;
}

export default function GameDisplayScrollComponent({
  templateSource,
  containerStyle,
  templateData,
  scrollData,
  layerHint,
}: GameDisplayScrollComponentProps) {
  const template =
    templateSource ??
    (layerHint === "foreground"
      ? ({
          sourceType: "embedded",
          content: "{{text}}",
        } as GameDisplayTemplate)
      : ({
          sourceType: "embedded",
          content: "",
        } as GameDisplayTemplate));

  const outerStyle: CSSProperties =
    layerHint === "foreground"
      ? {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          ...containerStyle,
        }
      : {
          backgroundImage: "url('/resources/old-paper.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          ...containerStyle,
        };

  return (
    <>
      {template && (
        <GameDisplayTemplateComponent
          templateSource={template}
          containerStyle={outerStyle}
          templateData={{ text: scrollData.text, ...templateData }}
        />
      )}
    </>
  );
}
