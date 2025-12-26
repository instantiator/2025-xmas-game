// import { useReward } from "partycles";
import { useEffect, useState, type CSSProperties } from "react";
import metadata from "../../../assets/resources/assets-metadata.json";
import oldPaperImage from "../../../assets/resources/old-paper.png";
import type { GameDisplayScrollComponentData } from "../../../entities/data/displays/GameDisplayScrollComponentData";
import type { GameDisplayTemplateSourceData } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import type { GameChallengeId } from "../../../entities/data/GameChallengeData";
import type { GameChallengeSolution } from "../../../entities/data/GameChallengeSolution";
import type { GameStageId } from "../../../entities/data/GameStageData";
import type { GameAnswerFunction } from "../Game";
import { parseLines } from "../logic/TemplateUtils";
import GameAudioComponent from "./GameAudioComponent";
import type { LayerHint } from "./GameDisplayComponent";
import GameDisplayTemplateComponent from "./GameDisplayTemplateComponent";
import GameTextInputComponent from "./GameTextInputComponent";

interface GameDisplayScrollComponentProps {
  templateSource?: GameDisplayTemplateSourceData;
  containerStyle?: React.CSSProperties;
  templateStyle?: CSSProperties;
  templateData?: Record<string, any>;
  scrollData: GameDisplayScrollComponentData;
  layerHint: LayerHint;
  stageId?: GameStageId;
  challengeId?: GameChallengeId;
  solution?: GameChallengeSolution;
  onAnswer?: GameAnswerFunction;
}

export default function GameDisplayScrollComponent({
  templateSource,
  containerStyle,
  templateStyle,
  templateData,
  scrollData,
  layerHint,
  stageId,
  challengeId,
  solution,
  onAnswer,
}: GameDisplayScrollComponentProps) {
  const paperMetadataEntry = metadata.resources.find((entry) => entry.file === "old-paper.png");
  const paperAspectRatio = `${paperMetadataEntry?.width}/${paperMetadataEntry?.height}`;

  const [solved, setSolved] = useState<boolean>(false);

  const [template, setTemplate] = useState<GameDisplayTemplateSourceData | undefined>(undefined);
  const [templateContainerStyle, setTemplateContainerStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setTemplate(
      templateSource ??
        (layerHint === "foreground"
          ? ({
              sourceType: "embedded",
              content: "{{#lines}}<p>{{.}}</p>{{/lines}}",
            } as GameDisplayTemplateSourceData)
          : ({
              sourceType: "embedded",
              content: "<!-- scroll -->",
            } as GameDisplayTemplateSourceData)),
    );

    setTemplateContainerStyle(
      layerHint === "foreground"
        ? {
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            aspectRatio: paperAspectRatio,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "5%",
            paddingRight: "5%",
            ...containerStyle,
          }
        : {
            backgroundImage: `url(${oldPaperImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.5))",
            ...containerStyle,
          },
    );
  }, [templateSource, layerHint, paperAspectRatio, containerStyle]);

  return (
    <>
      {template && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <GameDisplayTemplateComponent
            templateSource={template}
            containerStyle={templateContainerStyle}
            templateStyle={templateStyle}
            templateData={{ text: scrollData.text, lines: parseLines(scrollData.text), ...templateData }}
            solution={solution}
            onAnswer={onAnswer}
          >
            {layerHint === "foreground" && scrollData.media?.type === "audio" && (
              <GameAudioComponent
                audioStyle={{ margin: "10px", opacity: 0.25 }}
                media={scrollData.media}
                controls={true}
              />
            )}

            {layerHint === "foreground" && scrollData.showInput && (
              <GameTextInputComponent
                stageId={stageId}
                challengeId={challengeId}
                solved={solved}
                setSolved={setSolved}
                autoSubmit={true}
                onAnswer={onAnswer}
              />
            )}
          </GameDisplayTemplateComponent>
        </div>
      )}
    </>
  );
}
