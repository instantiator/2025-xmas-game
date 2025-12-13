import { useContext, useEffect, useState, type ReactNode } from "react";
import type { GameData, GameId } from "../entities/GameData";
import type { GameDisplayData, OverviewGameDisplay } from "../entities/GameDisplayData";
import { getBaseURL, getDirectoryURL, isDefined, isUndefinedOrWhitespaceOrEmpty } from "../util/ObjectUtils";
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
  const { repository, source: repositorySource } = useContext(GameRepositoryContext);

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

  useEffect(() => {
    const fetchDisplay = async (display: GameDisplayData): Promise<GameDisplayData> => {
      if (isUndefinedOrWhitespaceOrEmpty(display.foregroundTemplate.content)) {
        switch (display.foregroundTemplate.sourceType) {
          case "embedded":
            console.warn(`Display template marked as embedded but no content found: ${JSON.stringify(display)}`);
            return display;

          case "relative":
            if (isUndefinedOrWhitespaceOrEmpty(display.foregroundTemplate.templateSource)) {
              throw new Error(`Display template source is missing: ${JSON.stringify(display)}`);
            }
            switch (repositorySource.type) {
              case "RemoteRepository":
                // rewrite the display to be a url, relative to the repository url
                return await fetchDisplay({
                  ...display,
                  foregroundTemplate: {
                    ...display.foregroundTemplate,
                    sourceType: "url",
                    templateSource: new URL(
                      display.foregroundTemplate.templateSource!,
                      getDirectoryURL(repositorySource.src),
                    ).toString(),
                  },
                });

              case "LocalRepository":
                // rewrite to fetch the template content from the public directory
                return await fetchDisplay({
                  ...display,
                  foregroundTemplate: {
                    ...display.foregroundTemplate,
                    sourceType: "url",
                    templateSource: new URL(display.foregroundTemplate.templateSource!, getBaseURL()).toString(),
                  },
                });

              case "RawRepository":
                throw new Error(`Raw repositories do not support paths to content: ${JSON.stringify(display)}`);
            }
            break;

          case "url": {
            if (isUndefinedOrWhitespaceOrEmpty(display.foregroundTemplate.templateSource)) {
              throw new Error(`Display template source is missing: ${JSON.stringify(display)}`);
            }
            console.debug(`Fetching template at: ${display.foregroundTemplate.templateSource}`);
            const response = await fetch(display.foregroundTemplate.templateSource!);
            const text = await response.text();
            return { ...display, foregroundTemplate: { ...display.foregroundTemplate, content: text } };
          }
        }
      }
      return display;
    };

    const loadContent = async (data: GameData) => {
      const tasks: Promise<GameDisplayData>[] = [fetchDisplay(data.displays.overview)];
      const templates = await Promise.all(tasks);
      setGameLoading({
        loadingState: "ready",
        gameData: { ...data, displays: { overview: templates[0] as OverviewGameDisplay } },
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
  }, [gameLoading, repositorySource]);

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
