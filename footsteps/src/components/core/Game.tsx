import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import "./Game.css";
import type { GameChallengeId } from "../../entities/data/GameChallengeData";
import type { GameChallengeAnswerValidation } from "../../entities/data/GameChallengeSolution";
import type { GameStageId } from "../../entities/data/GameStageData";
import useFeatureFlags from "../../providers/FeatureFlagsHook";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import GameDisplayComponent from "./display/GameDisplayComponent";
import GameChallengeGrid from "./GameChallengeGrid";
import GameLayersLayout from "./GameLayersLayout";
import { getNewGameStateForClick } from "./logic/GameClickUtils";
import { findChallengeState } from "./logic/GameDataUtils";
import { completeChallenge, validateAnswer } from "./logic/GameStateUtils";
import { getRenderData } from "./logic/RenderDataUtils";

export type GameAnswerFunction = (
  stageId: GameStageId,
  challengeId: GameChallengeId,
  answer: string,
) => GameChallengeAnswerValidation[] | true;

interface DisplayLayers {
  inheritedBackgroundLayer?: ReactNode;
  inheritedBackgroundStyle?: CSSProperties;
  backgroundLayer: ReactNode;
  foregroundLayer: ReactNode;
}

export default function Game() {
  const { debug } = useFeatureFlags();
  const { resources } = useGameData();
  const { gameState, setGameState } = useGameState();

  const [layers, setLayers] = useState<DisplayLayers>({
    backgroundLayer: <></>,
    foregroundLayer: <></>,
  });

  useEffect(() => {
    console.debug(gameState);
  }, [gameState]);

  // Set the display layers whenever the game state changes
  useEffect(() => {
    const onAnswer: GameAnswerFunction = (stageId, challengeId, answer): GameChallengeAnswerValidation[] | true => {
      const challengeState = findChallengeState(gameState, stageId, challengeId);
      if (challengeState.succeeded) {
        return true; // ignore further attempts to submit an answer to a succeeded challenge
      }

      const challenge = challengeState.challenge;
      const validations = validateAnswer(challenge, answer);

      if (validations !== true) {
        return validations;
      }

      // complete the challenge and update the game state
      const newGameState = completeChallenge(gameState, stageId, challengeId);
      setGameState(newGameState);

      return true;
    };

    const renderData = getRenderData(gameState, resources);

    const inheritedBackgroundLayer = isDefined(renderData.inheritedRenderDatum) ? (
      <GameDisplayComponent render={renderData.inheritedRenderDatum} layerHint="background" onAnswer={onAnswer} />
    ) : undefined;

    const inheritedBackgroundStyle = renderData.inheritedRenderDatum?.component.backgroundStyle;

    const backgroundLayer = (
      <GameChallengeGrid>
        {renderData.gameRenderData.map((renderDatum) => (
          <GameDisplayComponent render={renderDatum} layerHint="background" onAnswer={onAnswer} />
        ))}
      </GameChallengeGrid>
    );

    const foregroundLayer = (
      <GameChallengeGrid>
        {renderData.gameRenderData.map((renderDatum) => (
          <GameDisplayComponent render={renderDatum} layerHint="foreground" onAnswer={onAnswer} />
        ))}
      </GameChallengeGrid>
    );

    setLayers({
      inheritedBackgroundLayer: inheritedBackgroundLayer,
      inheritedBackgroundStyle: inheritedBackgroundStyle,
      backgroundLayer: backgroundLayer,
      foregroundLayer: foregroundLayer,
    });
  }, [gameState, resources, setGameState]);

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
        id="game-container"
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
          inheritedBackgroundLayer={layers.inheritedBackgroundLayer}
          inheritedBackgroundStyle={layers.inheritedBackgroundStyle}
          backgroundLayer={layers.backgroundLayer}
          foregroundLayer={layers.foregroundLayer}
          cameraLayer={gameState.gameData.modules?.camera}
          onElementClick={handleElementClick}
        />
      </div>
    </>
  );
}
