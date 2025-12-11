import { useContext, useEffect, useState, type ReactNode } from "react";
import type { GameData, GameId } from "../entities/GameData";
import type { GameDisplayData } from "../entities/GameDisplayData";
import { isDefined, isUrl as isDefinedUrl, isWhitespaceOrEmpty } from "../util/ObjectUtils";
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
  const { repository, source } = useContext(GameRepositoryContext);

  const [gameLoading, setGameLoading] = useState<GameDataLoadingContextType>({
    loadingState: "waiting-for-repository",
    gameData: undefined,
  });

  const [gameData, setGameData] = useState<GameDataContextType | undefined>(undefined);

  useEffect(() => {
    setGameLoading({
      loadingState: repository.ready
        ? isDefined(repository.games[id])
          ? "loading-content"
          : "not-found"
        : "waiting-for-repository",
      gameData: repository.ready ? repository.games[id] : undefined,
    });
  }, [repository, id]);

  const fetchDisplay = async (display: GameDisplayData): Promise<GameDisplayData> => {
    if (isWhitespaceOrEmpty(display.template) && !isDefinedUrl(display.templateUrl)) {
      console.warn(`Display missing both template and templateUrl: ${JSON.stringify(display)}`);
    }

    if (isWhitespaceOrEmpty(display.template)) {
      if (isDefinedUrl(display.templateUrl)) {
        console.debug(`Fetching template at: ${display.templateUrl}`);
        const response = await fetch(display.templateUrl);
        const text = await response.text();
        return { ...display, template: text };
      }
    }

    return display;
  };

  useEffect(() => {
    const loadContent = async (data: GameData) => {
      const tasks: Promise<GameDisplayData>[] = data.displays.map((display) => fetchDisplay(display));
      const templates = await Promise.all(tasks);
      setGameLoading({
        loadingState: "ready",
        gameData: { ...data, displays: templates },
      });
    };

    if (gameLoading.loadingState === "loading-content" && isDefined(gameLoading.gameData)) {
      loadContent(gameLoading.gameData);
    }

    if (gameLoading.loadingState === "ready") {
      setGameData(
        isDefined(gameLoading.gameData) ? ({ gameData: gameLoading.gameData } as GameDataContextType) : undefined,
      );
    }
  }, [gameLoading]);

  useEffect(() => {
    console.info(`Game loading state: ${gameLoading.loadingState}`);
  }, [gameLoading.loadingState]);

  return (
    <>
      <GameDataLoadingContext.Provider value={gameLoading}>
        {!isDefined(gameData) && loadingView}
        {isDefined(gameData) && <GameDataContext.Provider value={gameData}>{children}</GameDataContext.Provider>}
      </GameDataLoadingContext.Provider>
    </>
  );
}
