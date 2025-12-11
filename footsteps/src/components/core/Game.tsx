import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import CameraOverlay from "../camera/CameraOverlay";
import { GameCss } from "./GameCss";
import GameDisplay from "./GameDisplay";

export default function Game() {
  const { gameData } = useGameData();
  const { gameState } = useGameState();

  const overview = gameData.displays.find((d) => d.type === "game-overview");

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          border: "solid 2px blue",
        }}
      >
        <GameCss />
        {gameState.currentChallenge === null && isDefined(overview) && (
          <GameDisplay display={overview} gameData={gameData} gameState={gameState} />
        )}
        <CameraOverlay />
      </div>
    </>
  );
}
