import MustacheTemplate from "react-mustache-template-component";
import type { GameDisplayData } from "../../entities/GameDisplayData";
import CameraOverlay from "../camera/CameraOverlay";

interface GameDisplayProps {
  display: GameDisplayData;
  gameContextData: Record<string, unknown>;
}

export default function GameDisplay({ display, gameContextData }: GameDisplayProps) {
  const templateData = { type: display.type, ...display.data, ...gameContextData };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...display.containerCss,
      }}
    >
      <CameraOverlay />
      <MustacheTemplate template={display.template.content ?? ""} data={templateData} />
    </div>
  );
}
