import { createContext, useState } from "react";
import type { GameId } from "../entities/GameData";

export interface GameState {
  gameId: GameId;
}

export interface GameStateProviderParams {
  gameId: GameId;
}

export interface GameStateContext {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
};

export const GameStateContext = createContext<GameStateContext>(null!);

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