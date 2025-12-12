import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import { GameCss } from "./GameCss";
import GameDisplay from "./GameDisplay";

export default function Game() {
  const { gameData } = useGameData();
  const { gameState } = useGameState();

  const overview = gameData.displays.overview;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          right: "5px",
          bottom: "5px",
          overflow: "hidden",
        }}
      >
        <GameCss />
        {gameState.currentChallenge === null && isDefined(overview) && (
          <GameDisplay display={overview} gameData={gameData} gameState={gameState} />
        )}
      </div>
    </>
  );
}
