import { type PropsWithChildren } from "react";
import type { GameData } from "../../entities/GameData";
import type { GameDisplayData } from "../../entities/GameDisplayData";
import type { GameState } from "../../entities/GameState";
import GameDisplay from "./GameDisplay";

interface OverviewGameDisplayProps {
  display: GameDisplayData;
  gameData: GameData;
  gameState: GameState;
}

export default function OverviewGameDisplay({
  display,
  gameData,
  gameState,
}: PropsWithChildren<OverviewGameDisplayProps>) {
  const gameContextData = { gameData, gameState };
  return <GameDisplay display={display} gameContextData={gameContextData} />;
}
