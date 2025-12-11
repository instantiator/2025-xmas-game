import { useGameData } from "../providers/GameDataHook";
import { useGameState } from "../providers/GameStateHook";
import { GameCss } from "./GameCss";
import GameDisplay from "./GameDisplay";

export default function Game() {
  const { gameData } = useGameData();
  const { gameState } = useGameState();
  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <GameCss />
        <GameDisplay display={gameData.displays[0]} gameData={gameData} gameState={gameState} />
      </div>
    </>
  );
}
