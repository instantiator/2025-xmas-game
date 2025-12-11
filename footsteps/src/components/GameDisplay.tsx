import { type PropsWithChildren } from "react";
import MustacheTemplate from "react-mustache-template-component";
import type { GameData } from "../entities/GameData";
import type { GameDisplayData } from "../entities/GameDisplayData";
import type { GameState } from "../entities/GameState";

interface GameDisplayProps {
  display: GameDisplayData;
  gameData: GameData;
  gameState: GameState;
}

export default function GameDisplay({ display, gameData, gameState }: PropsWithChildren<GameDisplayProps>) {
  const templateData = { ...display.data, gameData, gameState };
  return (
    <>
      <div
        style={{
          border: "solid 4px red",
          boxSizing: "border-box",
          height: "100%",
        }}
      >
        <MustacheTemplate template={display.template.content ?? ""} data={templateData} />
      </div>
    </>
  );
}
