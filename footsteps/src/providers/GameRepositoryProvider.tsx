import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import localRepository from "../assets/game-repository.json";
import type { GameRepository } from "../entities/GameRepository";
import type { GameSource } from "../entities/GameSource";
import { BLANK_REPOSITORY, GameRepositoryContext } from "./GameRepositoryContext";

interface GameRepositoryProviderParams {
  source: GameSource;
  children: ReactNode;
}

export default function GameRepositoryProvider({ source, children }: GameRepositoryProviderParams) {
  const [repository, setRepository] = useState<GameRepository>(BLANK_REPOSITORY);

  useEffect(() => {
    switch (source.type) {
      case "RemoteRepository":
        fetch(source.src.toString())
          .then(response => response.json())
          .then(data => setRepository({ ...data, ready: true } as GameRepository));
        break;
      case "LocalRepository":
        setRepository({ ...localRepository, ready: true } as GameRepository);
        break;
      case "RawRepository":
        setRepository({ ...source.repository, ready: true } as GameRepository);
        break;
    }
  }, [source]);

  return (
    <GameRepositoryContext.Provider value={repository}>
      {children}
    </GameRepositoryContext.Provider>
  );
}
