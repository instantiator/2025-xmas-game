import { useContext } from "react";
import { GameStateContext } from "./GameStateProvider";

export function useGameState() {
  const state = useContext(GameStateContext);
  return { state: state };
}
