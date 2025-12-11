import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import localRepository from "../assets/game-repository.json";
import {
  FAILED_REPOSITORY,
  LOADING_REPOSITORY,
  type GameRepository,
} from "../entities/GameRepository";
import type { GameSource } from "../entities/GameSource";
import { GameRepositoryContext } from "./GameRepositoryContext";

interface GameRepositoryProviderParams {
  source: GameSource;
  children: ReactNode;
}

export default function GameRepositoryProvider({
  source,
  children,
}: GameRepositoryProviderParams) {
  const [repository, setRepository] =
    useState<GameRepository>(LOADING_REPOSITORY);

  useEffect(() => {
    switch (source.type) {
      case "RemoteRepository":
        fetch(source.src.toString())
          .then((response) => response.json())
          .then((data) =>
            setRepository({ ...data, ready: true } as GameRepository),
          )
          .catch((error) => {
            console.error(error);
            setRepository({ ...FAILED_REPOSITORY, error: error.toString() });
          });
        break;
      case "LocalRepository":
        setRepository({
          ...localRepository,
          ready: true,
          loading: false,
        } as GameRepository);
        break;
      case "RawRepository":
        setRepository({
          ...source.repository,
          ready: true,
          loading: false,
        } as GameRepository);
        break;
    }
  }, [source]);

  return (
    <GameRepositoryContext.Provider value={{ source, repository }}>
      {children}
    </GameRepositoryContext.Provider>
  );
}
