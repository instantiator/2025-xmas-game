import _ from "lodash";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { NO_CHALLENGE_TEMPLATE, NO_OVERVIEW_GAME_TEMPLATE } from "../../constants/DefaultGameDisplays";
import useFeatureFlags from "../../providers/FeatureFlagsHook";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import ChallengeGrid from "./ChallengeGrid";
import GameLayersLayout from "./GameLayersLayout";
import GameTemplate from "./GameTemplate";

interface DisplayLayers {
  backgroundStyle?: CSSProperties;
  backgroundLayer?: ReactNode;
  foregroundLayer?: ReactNode;
}

export default function Game() {
  const { debug } = useFeatureFlags();
  const { gameId, gameData } = useGameData();
  const { gameState } = useGameState();

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
      const currentChallengesDisplayData = currentChallengeStates.map((challengeState) => {
        const challengeDisplayType = challengeState.challengeDisplay;
        const challengeDisplay = isDefined(challengeDisplayType)
          ? challengeState.challenge.displays[challengeDisplayType]
          : (challengeState.challenge.displays["challenge-title"] ??
            challengeState.challenge.displays["challenge-in-progress"] ??
            challengeState.challenge.displays["challenge-completed"]);
        const backgroundTemplate =
          challengeDisplay?.backgroundTemplate ??
          NO_CHALLENGE_TEMPLATE(challengeDisplayType ?? "challenge-in-progress");
        const foregroundTemplate =
          challengeDisplay?.foregroundTemplate ??
          NO_CHALLENGE_TEMPLATE(challengeDisplayType ?? "challenge-in-progress");
        const backgroundStyle = challengeDisplay?.backgroundStyle;
        const templateData = {
          gameId,
          gameData,
          gameState,
          challenge: challengeState.challenge,
          challengeData: challengeDisplay?.data,
          challengeState: challengeState,
        };
        const challengeKey = `${gameId}-${stage!.id}-${challengeState.challenge.id}`;
        return {
          challengeKey,
          challengeDisplay,
          backgroundStyle,
          backgroundTemplate,
          foregroundTemplate,
          templateData,
        };
      });

      setLayers({
        backgroundLayer: (
          <ChallengeGrid>
            {currentChallengesDisplayData.map(
              ({ challengeKey, challengeDisplay, backgroundTemplate, backgroundStyle, templateData }) => (
                <GameTemplate
                  key={`template-bg-${challengeKey}`}
                  display={challengeDisplay}
                  template={backgroundTemplate}
                  backgroundStyle={backgroundStyle}
                  gameContextData={templateData}
                />
              ),
            )}
          </ChallengeGrid>
        ),
        foregroundLayer: (
          <ChallengeGrid>
            {currentChallengesDisplayData.map(
              ({ challengeKey, challengeDisplay, foregroundTemplate, templateData }) => (
                <GameTemplate
                  key={`template-bg-${challengeKey}`}
                  display={challengeDisplay}
                  template={foregroundTemplate}
                  gameContextData={templateData}
                />
              ),
            )}
          </ChallengeGrid>
        ),
      });
    } else {
      // there's no current stage or challenge, so use the current game overview display
      const overviewDisplay = isDefined(gameState.current.overviewDisplay)
        ? Object.values(gameData.displays).find((d) => d.type === gameState.current.overviewDisplay)
        : (gameData.displays.title ?? gameData.displays.stages ?? undefined);

      if (!isDefined(overviewDisplay)) {
        throw new Error("No overview display found for game.");
      }

      const backgroundTemplate = overviewDisplay.backgroundTemplate ?? NO_OVERVIEW_GAME_TEMPLATE;
      const foregroundTemplate = overviewDisplay.foregroundTemplate ?? NO_OVERVIEW_GAME_TEMPLATE;

      const templateData = {
        gameData,
        gameState,
      };

      setLayers({
        backgroundStyle: overviewDisplay.backgroundStyle,
        backgroundLayer: (
          <GameTemplate display={overviewDisplay} template={backgroundTemplate} gameContextData={templateData} />
        ),
        foregroundLayer: (
          <GameTemplate display={overviewDisplay} template={foregroundTemplate} gameContextData={templateData} />
        ),
      });
    }
  }, [gameId, gameData, gameState]);

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
        />
      </div>
    </>
  );
}
