import { useContext } from "react";
import { GameDataContext } from "./GameDataContext";

export function useGameData() {
  const context = useContext(GameDataContext);
  return { game: context?.game, state: context?.state };
}