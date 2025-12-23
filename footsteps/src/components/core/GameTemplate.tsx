import { useEffect, useId, useState } from "react";
import MustacheTemplate from "react-mustache-template-component";
import type { GameDisplayData, GameDisplayTemplate } from "../../entities/data/GameDisplayData";
import useContentCache from "../../providers/GameContentCacheHook";
import { isDefined } from "../../util/ObjectUtils";
import type { GameTemplateData } from "./logic/GameDisplayRenderDataGeneration";

interface GameDisplayProps {
  display: GameDisplayData | undefined;
  template: GameDisplayTemplate | undefined;
  gameContextData: GameTemplateData;
  containerStyle?: React.CSSProperties;
}

export default function GameTemplate({ display, template, gameContextData, containerStyle }: GameDisplayProps) {
  const [render, setRender] = useState<GameDisplayTemplate | undefined>();

  const { getTemplate } = useContentCache();

  const uid = useId();

  useEffect(() => {
    async function loadTemplate() {
      console.debug("Loading template...", template);
      const retrieved = await getTemplate(template);
      console.debug("Template loaded.");
      setRender(retrieved);
    }
    loadTemplate();
  }, [template, getTemplate]);

  const templateData = { ...display?.data, ...gameContextData };

  const templateStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
  };

  return (
    <div key={`template-${uid}`} style={{ width: "100%", height: "100%", ...containerStyle }}>
      {isDefined(render) && (
        <MustacheTemplate template={render.content ?? ""} data={templateData} style={templateStyle} />
      )}
    </div>
  );
}
