import { useReward } from "partycles";
import { useEffect, useState } from "react";
import music1 from "../../assets/resources/music-1.mp3";
import music2 from "../../assets/resources/music-2.mp3";
import winSound from "../../assets/resources/win-sound.mp3";
import type { GameOverviewDisplayPurpose } from "../../entities/data/displays/GameDisplayData";
import type { GameChallengeId } from "../../entities/data/GameChallengeData";
import type { GameChallengeAnswerValidation } from "../../entities/data/GameChallengeSolution";
import type { GameStageId } from "../../entities/data/GameStageData";
import useFeatureFlags from "../../providers/FeatureFlagsHook";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import GameDisplayComponent, { type LayerHint } from "./display/GameDisplayComponent";
import "./Game.css";
import GameLayersLayout, { type GameLayers } from "./layout/GameLayersLayout";
import { getNewGameStateForClick } from "./logic/GameClickUtils";
import { findChallengeState } from "./logic/GameDataUtils";
import { completeChallenge, validateAnswer } from "./logic/GameStateUtils";
import { calcOverviewDisplay, getLayeredRenderData, type GameDisplayRenderData } from "./logic/RenderDataUtils";

export type GameAnswerFunction = (
  stageId: GameStageId,
  challengeId: GameChallengeId,
  answer: string,
) => GameChallengeAnswerValidation[] | true;

export default function Game() {
  const { debug } = useFeatureFlags();
  const { resources } = useGameData();

  // rendering
  const [layers, setLayers] = useState<GameLayers>({});

  // tracking
  const { gameState, setGameState } = useGameState();
  const [completedStagesTracker, setCompletedStagesTracker] = useState<GameStageId[]>([]);
  const [overviewDisplayPurposeTracker, setOverviewDisplayPurposeTracker] = useState<
    GameOverviewDisplayPurpose | undefined
  >();

  // animation and sound
  const { reward } = useReward("reward-element", "fireworks", {
    particleCount: 200,
  });

  const playAudio = async (res: string) => {
    try {
      const audio = new Audio(res);
      await audio.play();
    } catch (err: any) {
      console.error("Error playing audio:", err);
    }
  };

  useEffect(() => {
    console.debug(gameState);

    const newCompletedStages = gameState.stages
      .filter((stageState) => stageState.completion === "completed")
      .map((stageState) => stageState.stage.id);

    if (newCompletedStages.some((stageId) => !completedStagesTracker.includes(stageId))) {
      reward();
      playAudio(winSound);
      setCompletedStagesTracker(newCompletedStages);
    }
  }, [gameState, completedStagesTracker, reward]);

  useEffect(() => {
    const currentOverviewDisplay = calcOverviewDisplay(gameState);
    if (currentOverviewDisplay?.purpose !== overviewDisplayPurposeTracker) {
      setOverviewDisplayPurposeTracker(currentOverviewDisplay?.purpose);
      // TODO: do this with a real resource
      if (currentOverviewDisplay?.purpose === "game-overview-stages") {
        playAudio(music1);
      }
      if (currentOverviewDisplay?.purpose === "game-overview-complete") {
        playAudio(music2);
      }
    }
  }, [gameState, overviewDisplayPurposeTracker]);

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

    const createDisplayComponents = (
      renderData: (GameDisplayRenderData | undefined)[] | undefined,
      layerHint: LayerHint,
    ) =>
      renderData
        ?.filter(isDefined)
        .map((renderDatum) => (
          <GameDisplayComponent
            key={`${renderDatum.stageId}-${renderDatum.challengeId}-display-component`}
            render={renderDatum}
            layerHint={layerHint}
            onAnswer={onAnswer}
          />
        ));

    const renderData = getLayeredRenderData(gameState, resources);
    setLayers({
      overview: {
        backgroundLayerNodes: createDisplayComponents([renderData.overviewRenderData], "background"),
        foregroundLayerNodes: createDisplayComponents([renderData.overviewRenderData], "foreground"),
      },
      stage: {
        backgroundLayerNodes: createDisplayComponents([renderData.stageRenderData], "background"),
        foregroundLayerNodes: createDisplayComponents([renderData.stageRenderData], "foreground"),
      },
      challenges: {
        backgroundLayerNodes: createDisplayComponents(renderData.challengesRenderData, "background"),
        foregroundLayerNodes: createDisplayComponents(renderData.challengesRenderData, "foreground"),
      },
    });
  }, [gameState, resources, setGameState]);

  const handleElementClick = (layerId: string, elementId: string) => {
    console.info(`Element ${elementId} on layer ${layerId} clicked.`);
    const newState = getNewGameStateForClick(gameState, layerId, elementId);
    if (isDefined(newState)) {
      console.info("Updating game state from click.", newState);
      setGameState(newState);
      return true;
    } else {
      return false;
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
        <div
          id="reward-element"
          style={{ position: "absolute", top: "50vh", left: "50vw", width: 0, height: 0, pointerEvents: "none" }}
        />
        <GameLayersLayout
          debug={debug}
          gameLayers={layers}
          cameraLayer={gameState.gameData.modules?.camera}
          onElementClick={handleElementClick}
        />
      </div>
    </>
  );
}
