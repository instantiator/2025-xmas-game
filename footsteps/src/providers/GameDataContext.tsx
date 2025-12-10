import { createContext } from "react";
import type { GameData } from "../entities/GameData";

export interface GameDataLoadingContextType {
  loadingState: "ready" | "loading" | "not found";
  gameData?: GameData;
}

export interface GameDataContextType {
  gameData: GameData;
}

export const GameDataLoadingContext = createContext<GameDataLoadingContextType>(null!);
export const GameDataContext = createContext<GameDataContextType>(null!);
