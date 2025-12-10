import { useContext } from "react";
import { GameStateContext } from "./GameStateContext";

export function useGameState() {
  const state = useContext(GameStateContext);
  return { state: state };
}
