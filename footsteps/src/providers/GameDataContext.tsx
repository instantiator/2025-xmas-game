import { createContext } from "react";
import type { GameData } from "../entities/GameData";

export interface GameDataContextType {
  state: "ready" | "loading" | "not found";
  game?: GameData;
}

export const GameDataContext = createContext<GameDataContextType>(null!);
