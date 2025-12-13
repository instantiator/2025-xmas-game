import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { NO_CHALLENGE_TEMPLATE, NO_OVERVIEW_GAME_TEMPLATE } from "../../constants/DefaultGameDisplays";
import type { ChallengeGameDisplayType } from "../../entities/GameDisplayData";
import { useGameData } from "../../providers/GameDataHook";
import { useGameState } from "../../providers/GameStateHook";
import { isDefined } from "../../util/ObjectUtils";
import GameLayersLayout from "./GameLayersLayout";
import GameTemplate from "./GameTemplate";

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
    const challenge = isDefined(gameState.current.challengeId)
      ? gameState.challenges[gameState.current.challengeId].challenge
      : undefined;

    if (isDefined(challenge)) {
      const challengeDisplayType: ChallengeGameDisplayType = "challenge-in-progress"; // TODO: pick
      const challengeDisplay = challenge.displays.find((d) => d.type === challengeDisplayType);
      const backgroundTemplate = challengeDisplay?.backgroundTemplate ?? NO_CHALLENGE_TEMPLATE(challengeDisplayType);
      const foregroundTemplate = challengeDisplay?.foregroundTemplate ?? NO_CHALLENGE_TEMPLATE(challengeDisplayType);
      const templateData = {
        gameData,
        gameState,
        challengeData: challengeDisplay?.data,
        challengeState: gameState.challenges[gameState.current.challengeId!],
      };

      setLayers({
        backgroundStyle: challengeDisplay?.backgroundStyle,
        backgroundLayer: (
          <GameTemplate display={challengeDisplay} template={backgroundTemplate} gameContextData={templateData} />
        ),
        foregroundLayer: (
          <GameTemplate display={challengeDisplay} template={foregroundTemplate} gameContextData={templateData} />
        ),
      });
    } else {
      const overviewDisplay = gameData.displays.overview;
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
  }, [gameData, gameState]);

  const debug = true;

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
        />
      </div>
    </>
  );
}
