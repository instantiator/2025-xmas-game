import _ from "lodash";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import useFeatureFlags from "../../providers/FeatureFlagsHook";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import ChallengeGrid from "./ChallengeGrid";
import GameLayersLayout from "./GameLayersLayout";
import GameTemplate from "./GameTemplate";
import { getNewGameStateForClick } from "./logic/GameClickHandling";
import { generateChallengesRenderData, generateOverviewRenderData } from "./logic/GameDisplayRenderDataGeneration";

interface DisplayLayers {
  backgroundStyle?: CSSProperties;
  backgroundLayer?: ReactNode;
  foregroundLayer?: ReactNode;
}

export default function Game() {
  const { debug } = useFeatureFlags();
  const { gameId, gameData } = useGameData();
  const { gameState, setGameState } = useGameState();

  const [layers, setLayers] = useState<DisplayLayers>({});

  // Select the current stage, challenge, and set the display layers
  useEffect(() => {
    const stage = isDefined(gameState.current.stageId)
      ? gameData.stages.find((s) => s.id === gameState.current.stageId)
      : undefined;

    const stageState = gameState.stages.find((s) => s.stage.id === stage?.id);
    const chunking = stage?.challengeChunking ?? 1;
    const chunkedChallengeStates = _.chunk(stageState?.challengeStates ?? [], chunking);
    const currentChallengeStates = chunkedChallengeStates.find((chunk) => !chunk.some((c) => c.succeeded));

    if (isDefined(currentChallengeStates)) {
      const currentStageChallengesRenderData = generateChallengesRenderData(
        gameId,
        gameData,
        gameState,
        currentChallengeStates,
      );
      setLayers({
        backgroundLayer: (
          <ChallengeGrid>
            {currentStageChallengesRenderData.map(
              ({ challengeKey, challengeDisplay, backgroundTemplate, backgroundStyle, templateData }) => (
                <GameTemplate
                  key={`template-bg-${challengeKey}`}
                  display={challengeDisplay}
                  template={backgroundTemplate}
                  containerStyle={backgroundStyle}
                  gameContextData={templateData}
                />
              ),
            )}
          </ChallengeGrid>
        ),
        foregroundLayer: (
          <ChallengeGrid>
            {currentStageChallengesRenderData.map(
              ({ challengeKey, challengeDisplay, foregroundTemplate, foregroundStyle, templateData }) => (
                <GameTemplate
                  key={`template-bg-${challengeKey}`}
                  display={challengeDisplay}
                  template={foregroundTemplate}
                  containerStyle={foregroundStyle}
                  gameContextData={templateData}
                />
              ),
            )}
          </ChallengeGrid>
        ),
      });
    } else {
      // there's no current stage or challenge, so use the current game overview display
      const overviewRenderData = generateOverviewRenderData(gameId, gameData, gameState);
      setLayers({
        // backgroundStyle: overviewRenderData.overviewDisplay.backgroundStyle,
        backgroundLayer: (
          <GameTemplate
            display={overviewRenderData.overviewDisplay}
            template={overviewRenderData.backgroundTemplate}
            containerStyle={overviewRenderData.overviewDisplay.backgroundStyle}
            gameContextData={overviewRenderData.templateData}
          />
        ),
        foregroundLayer: (
          <GameTemplate
            display={overviewRenderData.overviewDisplay}
            template={overviewRenderData.foregroundTemplate}
            containerStyle={overviewRenderData.overviewDisplay.foregroundStyle}
            gameContextData={overviewRenderData.templateData}
          />
        ),
      });
    }
  }, [gameId, gameData, gameState]);

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
          ...gameData.gameContainerStyle,
        }}
      >
        <GameLayersLayout
          debug={debug}
          backgroundLayer={layers.backgroundLayer}
          backgroundStyle={layers.backgroundStyle}
          foregroundLayer={layers.foregroundLayer}
          cameraLayer={gameData.modules?.camera}
          onElementClick={handleElementClick}
        />
      </div>
    </>
  );
}
