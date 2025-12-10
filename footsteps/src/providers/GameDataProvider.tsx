import { useContext } from "react";
import type { GameId } from "../entities/GameData";
import { GameDataContext, type GameDataContextType } from "./GameDataContext";
import { GameRepositoryContext } from "./GameRepositoryContext";

interface GameDataProviderParams {
  id: GameId;
}

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