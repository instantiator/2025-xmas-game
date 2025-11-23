import { useContext } from "react";
import type { GameId } from "../entities/GameData";
import { GameRepositoryContext } from "./GameRepositoryProvider";

export function useGameData(id: GameId) {
  const repository = useContext(GameRepositoryContext);
  return { gameData: repository.games[id] };
}