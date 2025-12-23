import { useEffect, useId, useState } from "react";
import MustacheTemplate from "react-mustache-template-component";
import type { GameDisplayTemplate as GameDisplayTemplateData } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import useContentCache from "../../../providers/GameContentCacheHook";
import { isDefined } from "../../../util/ObjectUtils";

interface GameDisplayProps {
  templateSource: GameDisplayTemplateData;
  templateData: Record<string, any>;
  containerStyle?: React.CSSProperties;
}

export default function GameDisplayTemplateComponent({
  templateSource,
  templateData,
  containerStyle,
}: GameDisplayProps) {
  const [render, setRender] = useState<GameDisplayTemplateData | undefined>();

  const { getTemplate } = useContentCache();

  const uid = useId();

  useEffect(() => {
    async function loadTemplate() {
      console.debug("Loading template...", templateSource);
      const retrieved = await getTemplate(templateSource);
      console.debug("Template loaded.");
      setRender(retrieved);
    }
    loadTemplate();
  }, [templateSource, getTemplate]);

  return (
    <div key={`template-${uid}`} style={{ width: "100%", height: "100%", ...containerStyle }}>
      {isDefined(render) && <MustacheTemplate template={render.content ?? ""} data={templateData} />}
    </div>
  );
}
