import { createContext } from "react";
import type { GameData, GameId } from "../entities/data/GameData";

export type GameDataLoadingState = "waiting-for-repository" | "ready" | "not-found";

export interface GameDataLoadingContextType {
  loadingState: GameDataLoadingState;
}

export interface GameDataContextType {
  gameData: GameData;
  gameId: GameId | undefined;
}

export const GameDataLoadingContext = createContext<GameDataLoadingContextType>(null!);
export const GameDataContext = createContext<GameDataContextType>(null!);
