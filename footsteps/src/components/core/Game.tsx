import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import useFeatureFlags from "../../providers/FeatureFlagsHook";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import GameDisplayComponent from "./display/GameDisplayComponent";
import GameChallengeGrid from "./GameChallengeGrid";
import GameLayersLayout from "./GameLayersLayout";
import { getNewGameStateForClick } from "./logic/GameClickHandling";
import { getRenderData } from "./logic/GameDisplayRenderDataGeneration";

interface DisplayLayers {
  backgroundStyle?: CSSProperties;
  backgroundLayer?: ReactNode;
  foregroundLayer?: ReactNode;
}

export default function Game() {
  const { debug } = useFeatureFlags();
  const { resources } = useGameData();
  const { gameState, setGameState } = useGameState();

  const [layers, setLayers] = useState<DisplayLayers>({});

  // Set the display layers whenever the game state changes
  useEffect(() => {
    const renderData = getRenderData(gameState, resources);
    setLayers({
      backgroundLayer: (
        <GameChallengeGrid>
          {renderData.map((renderDatum) => (
            <GameDisplayComponent render={renderDatum} layerHint="background" />
          ))}
        </GameChallengeGrid>
      ),
      foregroundLayer: (
        <GameChallengeGrid>
          {renderData.map((renderDatum) => (
            <GameDisplayComponent render={renderDatum} layerHint="foreground" />
          ))}
        </GameChallengeGrid>
      ),
    });
  }, [gameState, resources]);

  const handleElementClick = (layerId: string, elementId: string) => {
    console.info(`Element ${elementId} on layer ${layerId} clicked.`);
    const newState = getNewGameStateForClick(gameState, layerId, elementId);
    if (isDefined(newState)) {
      console.info("Updating game state from click.", newState);
      setGameState(newState);
    }
  };

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
          ...gameState.gameData.gameContainerStyle,
        }}
      >
        <GameLayersLayout
          debug={debug}
          backgroundLayer={layers.backgroundLayer}
          backgroundStyle={layers.backgroundStyle}
          foregroundLayer={layers.foregroundLayer}
          cameraLayer={gameState.gameData.modules?.camera}
          onElementClick={handleElementClick}
        />
      </div>
    </>
  );
}
