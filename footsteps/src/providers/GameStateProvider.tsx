import { useState } from "react";
import type { GameId } from "../entities/GameData";
import type { GameState } from "../entities/GameState";
import { GameStateContext } from "./GameStateContext";

export interface GameStateProviderParams {
  gameId: GameId;
}

export default function GameStateProvider({ gameId, children }: React.PropsWithChildren<GameStateProviderParams>) {
  const [gameState, setGameState] = useState<GameState>({
    gameId: gameId,
  });

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};