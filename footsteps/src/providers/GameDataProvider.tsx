import { useContext, useEffect, useState, type ReactNode } from "react";
import type { GameId } from "../entities/GameData";
import { isDefined } from "../util/ObjectUtils";
import GameContentCacheProvider from "./GameContentCacheProvider";
import {
  GameDataContext,
  GameDataLoadingContext,
  type GameDataContextType,
  type GameDataLoadingContextType,
} from "./GameDataContext";
import { GameRepositoryContext } from "./GameRepositoryContext";

interface GameDataProviderParams {
  id: GameId;
  loadingView?: ReactNode;
}

export function GameDataProvider({ id, children, loadingView }: React.PropsWithChildren<GameDataProviderParams>) {
  const { repository } = useContext(GameRepositoryContext);

  const [gameLoading, setGameLoading] = useState<GameDataLoadingContextType>({
    loadingState: "waiting-for-repository",
  });

  const [gameData, setGameData] = useState<GameDataContextType | undefined>(undefined);

  useEffect(() => {
    setGameLoading({
      loadingState: repository.ready
        ? isDefined(repository.games[id])
          ? "ready"
          : "not-found"
        : "waiting-for-repository",
    });
    setGameData(repository.ready ? { gameData: repository.games[id] } : undefined);
  }, [repository, id]);

  useEffect(() => {
    console.info(`Game loading state: ${gameLoading.loadingState}`);
  }, [gameLoading.loadingState]);

  return (
    <>
      <GameDataLoadingContext.Provider value={gameLoading}>
        {!isDefined(gameData) && loadingView}
        {isDefined(gameData) && (
          <>
            <GameDataContext.Provider value={gameData}>
              <GameContentCacheProvider>{children}</GameContentCacheProvider>
            </GameDataContext.Provider>
          </>
        )}
      </GameDataLoadingContext.Provider>
    </>
  );
}
