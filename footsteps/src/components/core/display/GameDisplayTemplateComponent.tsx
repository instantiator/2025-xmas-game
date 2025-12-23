import Mustache from "mustache";
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

const MUSTACHE_OPTIONS: Mustache.RenderOptions = {
  escape: (text) => text, // disable HTML escaping
};

export default function GameDisplayTemplateComponent({
  templateSource,
  templateData,
  containerStyle,
}: GameDisplayProps) {
  const [render, setRender] = useState<GameDisplayTemplateData | undefined>();

  const { getTemplate } = useContentCache();

  const uid = useId();

  const containerStyleParsed = isDefined(containerStyle)
    ? Object.fromEntries(
        Object.entries(containerStyle).map(([key, value]) => [
          key,
          Mustache.render(value, templateData, undefined, MUSTACHE_OPTIONS),
        ]),
      )
    : undefined;

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
    <div key={`template-${uid}`} style={{ width: "100%", height: "100%", ...containerStyleParsed }}>
      {isDefined(render) && <MustacheTemplate template={render.content ?? ""} data={templateData} />}
    </div>
  );
}
