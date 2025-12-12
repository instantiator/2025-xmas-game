import { NO_OVERVIEW_GAME_DISPLAY } from "../../constants/DefaultGameDisplays";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined, isDefinedAndHasContent, isUndefinedOrWhitespaceOrEmpty } from "../../util/ObjectUtils";
import CameraOverlay from "../camera/CameraOverlay";
import ChallengeGameDisplay from "./ChallengeGameDisplay";
import { GameCss } from "./GameCss";
import OverviewGameDisplay from "./OverviewGameDisplay";

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
        <CameraOverlay />

        {!isDefined(gameState.current.challengeId) && isUndefinedOrWhitespaceOrEmpty(overview.template.content) && (
          <OverviewGameDisplay display={NO_OVERVIEW_GAME_DISPLAY} gameData={gameData} gameState={gameState} />
        )}

        {!isDefined(gameState.current.challengeId) && isDefinedAndHasContent(overview.template.content) && (
          <OverviewGameDisplay display={overview} gameData={gameData} gameState={gameState} />
        )}

        {isDefined(gameState.current.challengeId) && (
          <ChallengeGameDisplay gameData={gameData} gameState={gameState} challengeId={gameState.current.challengeId} />
        )}
      </div>
    </>
  );
}
