import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { NO_OVERVIEW_GAME_DISPLAY } from "../../constants/DefaultGameDisplays";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined, isDefinedAndHasContent, isUndefinedOrWhitespaceOrEmpty } from "../../util/ObjectUtils";
import ChallengeGameDisplay from "./ChallengeGameDisplay";
import GameLayersLayout from "./GameLayersLayout";
import OverviewGameDisplay from "./OverviewGameDisplay";

interface DisplayLayers {
  backgroundStyle?: CSSProperties;
  backgroundLayer?: ReactNode;
  foregroundLayer?: ReactNode;
}

export default function Game() {
  const { gameData } = useGameData();
  const { gameState } = useGameState();

  const [layers, setLayers] = useState<DisplayLayers>({});

  useEffect(() => {
    if (
      !isDefined(gameState.current.challengeId) &&
      isUndefinedOrWhitespaceOrEmpty(gameData.displays.overview.foregroundTemplate.content)
    ) {
      setLayers({
        backgroundLayer: (
          <OverviewGameDisplay display={NO_OVERVIEW_GAME_DISPLAY} gameData={gameData} gameState={gameState} />
        ),
        backgroundStyle: undefined,
      });
    }
    if (
      !isDefined(gameState.current.challengeId) &&
      isDefinedAndHasContent(gameData.displays.overview.foregroundTemplate.content)
    ) {
      setLayers({
        backgroundLayer: (
          <OverviewGameDisplay display={gameData.displays.overview} gameData={gameData} gameState={gameState} />
        ),
        backgroundStyle: gameData.displays.overview.containerStyle,
      });
    }
    if (isDefined(gameState.current.challengeId)) {
      setLayers({
        backgroundLayer: (
          <ChallengeGameDisplay gameData={gameData} gameState={gameState} challengeId={gameState.current.challengeId} />
        ),
        backgroundStyle: gameState.challenges[gameState.current.challengeId].challenge.displays[0].containerStyle, // TODO - pick the style
      });
    }
  }, [gameData, gameState]);

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
          ...gameData.gameContainerStyle,
        }}
      >
        <GameLayersLayout
          backgroundLayer={layers.backgroundLayer}
          backgroundStyle={layers.backgroundStyle}
          foregroundLayer={layers.foregroundLayer}
        />
      </div>
    </>
  );
}
