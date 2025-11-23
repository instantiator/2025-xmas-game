import { createContext, useContext } from "react";
import type { GameData, GameId } from "../entities/GameData";
import { GameRepositoryContext } from "./GameRepositoryProvider";

export interface GameDataProviderParams {
  id: GameId;
}

export interface GameDataContextType {
  state: "ready" | "loading" | "not found";
  game?: GameData;
}

export const GameDataContext = createContext<GameDataContextType>(null!);

export function GameDataProvider({ id, children }: React.PropsWithChildren<GameDataProviderParams>) {
  const repository = useContext(GameRepositoryContext);
  const gameData = {
    state: repository.ready ? (repository.games[id] ? "ready" : "not found") : "loading",
    game: repository.ready ? repository.games[id] : undefined
  } as GameDataContextType;

  return (
    <GameDataContext.Provider value={gameData}>
      {children}
    </GameDataContext.Provider>
  );
}