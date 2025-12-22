import { useEffect, useState } from "react";
import MustacheTemplate from "react-mustache-template-component";
import type { GameDisplayData, GameDisplayTemplate } from "../../entities/data/GameDisplayData";
import useContentCache from "../../providers/GameContentCacheHook";
import { isDefined } from "../../util/ObjectUtils";

interface GameDisplayProps {
  display: GameDisplayData | undefined;
  template: GameDisplayTemplate | undefined;
  gameContextData: Record<string, unknown>;
  backgroundStyle?: React.CSSProperties;
}

export default function GameTemplate({ display, template, gameContextData, backgroundStyle }: GameDisplayProps) {
  const [render, setRender] = useState<GameDisplayTemplate | undefined>();

  const { getTemplate } = useContentCache();

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

  return (
    <div style={backgroundStyle}>
      {isDefined(render) && <MustacheTemplate template={render.content ?? ""} data={templateData} />}
    </div>
  );
}
