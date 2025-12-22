import { createContext } from "react";
import type { GameDisplayTemplate } from "../entities/data/GameDisplayData";

export interface GameContentCache {
  templates: GameDisplayTemplate[];
}

export const BLANK_CACHE: GameContentCache = {
  templates: [],
};

export const GameContentCacheContext = createContext<{
  cache: GameContentCache;
  setCache: React.Dispatch<React.SetStateAction<GameContentCache>>;
}>(undefined!);
