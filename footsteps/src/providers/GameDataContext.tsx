import { createContext } from "react";
import type { GameData } from "../entities/GameData";

export type GameDataLoadingState = "waiting-for-repository" | "loading-content" | "ready" | "not-found";

export interface GameDataLoadingContextType {
  loadingState: GameDataLoadingState;
  gameData?: GameData;
}

export interface GameDataContextType {
  gameData: GameData;
}

export const GameDataLoadingContext = createContext<GameDataLoadingContextType>(null!);
export const GameDataContext = createContext<GameDataContextType>(null!);
