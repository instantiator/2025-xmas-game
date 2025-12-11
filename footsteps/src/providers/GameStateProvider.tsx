import { useState, type ReactNode } from "react";
import { blankGameState, type GameState } from "../entities/GameState";
import { useGameData } from "./GameDataHook";
import { GameStateContext } from "./GameStateContext";

export default function GameStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { gameData } = useGameData();
  const [gameState, setGameState] = useState<GameState>(
    blankGameState(gameData),
  );

  return (
    <GameStateContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameStateContext.Provider>
  );
}
