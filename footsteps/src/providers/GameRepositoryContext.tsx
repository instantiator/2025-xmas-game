import { createContext } from "react";
import type { GameRepository } from "../entities/GameRepository";

export const BLANK_REPOSITORY: GameRepository = { ready: false, games: {} };

export const GameRepositoryContext = createContext<GameRepository>(null!);
