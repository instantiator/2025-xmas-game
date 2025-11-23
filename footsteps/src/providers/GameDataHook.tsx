import { useContext } from "react";
import { GameDataContext } from "./GameDataProvider";

export function useGameData() {
  const context = useContext(GameDataContext);
  return { game: context?.game, state: context?.state };
}