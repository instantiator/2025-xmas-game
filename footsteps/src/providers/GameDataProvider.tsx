import { useContext, useEffect, useState, type ReactNode } from "react";
import type { GameId } from "../entities/GameData";
import { defined } from "../util/ObjectUtils";
import { GameDataContext, GameDataLoadingContext, type GameDataContextType, type GameDataLoadingContextType } from "./GameDataContext";
import { GameRepositoryContext } from "./GameRepositoryContext";

interface GameDataProviderParams {
  id: GameId;
  loadingView?: ReactNode;
}

export function GameDataProvider({ id, children, loadingView }: React.PropsWithChildren<GameDataProviderParams>) {
  const repository = useContext(GameRepositoryContext);

  const [gameLoading, setGameLoading] = useState<GameDataLoadingContextType>({
    loadingState: "loading",
    gameData: undefined
  });

  const [gameData, setGameData] = useState<GameDataContextType | undefined>(undefined);

  useEffect(() => {
    setGameLoading({
      loadingState: repository.ready ? (repository.games[id] ? "ready" : "not found") : "loading",
      gameData: repository.ready ? repository.games[id] : undefined
    });
  }, [repository, id]);
  
  useEffect(() => {
    setGameData(defined(gameLoading.gameData) ? { gameData: gameLoading.gameData } as GameDataContextType : undefined);
  }, [gameLoading]);

  return (<>
    <GameDataLoadingContext.Provider value={gameLoading}>
      {!defined(gameData) && loadingView}
      {defined(gameData) &&
      <GameDataContext.Provider value={gameData}>
        {children}
      </GameDataContext.Provider>}
    </GameDataLoadingContext.Provider>
  </>);
}