import { NO_TEMPLATE } from "../../../constants/DefaultGameDisplays";
import type { GameDisplayScrollComponentData } from "../../../entities/data/displays/GameDisplayScrollComponentData";
import type { GameDisplayTemplateComponentData } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import type { GameDisplayRenderData } from "../logic/GameDisplayRenderDataGeneration";
import GameDisplayScrollComponent from "./GameDisplayScrollComponent";
import GameDisplayTemplateComponent from "./GameDisplayTemplateComponent";

export type LayerHint = "background" | "foreground";

interface GameDisplayComponentProps {
  render: GameDisplayRenderData;
  layerHint: LayerHint;
}

export default function GameDisplayComponent({ render, layerHint }: GameDisplayComponentProps) {
  const templateSource = (
    component: GameDisplayTemplateComponentData | GameDisplayScrollComponentData,
    layerHint: LayerHint,
  ) => (layerHint === "background" ? component.backgroundTemplate : component.foregroundTemplate);

  const containerStyle = (
    component: GameDisplayTemplateComponentData | GameDisplayScrollComponentData,
    layerHint: LayerHint,
  ) => (layerHint === "background" ? component.backgroundStyle : component.foregroundStyle);

  return (
    <>
      {render.component.type === "template" && (
        <GameDisplayTemplateComponent
          templateSource={templateSource(render.component, layerHint) ?? NO_TEMPLATE}
          containerStyle={containerStyle(render.component, layerHint)}
          templateData={render.templateData}
        />
      )}
      {render.component.type === "scroll" && (
        <GameDisplayScrollComponent
          templateSource={templateSource(render.component, layerHint)}
          containerStyle={containerStyle(render.component, layerHint)}
          templateData={render.templateData}
          scrollData={render.component}
          layerHint={layerHint}
        />
      )}
    </>
  );
}
