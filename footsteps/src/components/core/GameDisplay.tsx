import { type PropsWithChildren } from "react";
import MustacheTemplate from "react-mustache-template-component";
import type { GameData } from "../../entities/GameData";
import type { GameDisplayData } from "../../entities/GameDisplayData";
import type { GameState } from "../../entities/GameState";
import CameraOverlay from "../camera/CameraOverlay";

interface GameDisplayProps {
  display: GameDisplayData;
  gameData: GameData;
  gameState: GameState;
}

export default function GameDisplay({ display, gameData, gameState }: PropsWithChildren<GameDisplayProps>) {
  const templateData = { ...display.data, gameData, gameState };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        ...display.containerCss,
        overflow: "hidden",
      }}
    >
      <CameraOverlay />
      <MustacheTemplate template={display.template.content ?? ""} data={templateData} />
    </div>
  );
}
