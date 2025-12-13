import MustacheTemplate from "react-mustache-template-component";
import type { GameDisplayData } from "../../entities/GameDisplayData";

interface GameDisplayProps {
  display: GameDisplayData;
  gameContextData: Record<string, unknown>;
}

export default function GameDisplay({ display, gameContextData }: GameDisplayProps) {
  const templateData = { type: display.type, ...display.data, ...gameContextData };
  return (
    <div>
      <MustacheTemplate template={display.foregroundTemplate.content ?? ""} data={templateData} />
    </div>
  );
}
