import { useCallback, useEffect, useState, type CSSProperties } from "react";
import oldPaperImage from "../../../assets/resources/old-paper.png";
import metadata from "../../../assets/resources/resource-metadata.json";
import type { GameDisplayScrollComponentData } from "../../../entities/data/displays/GameDisplayScrollComponentData";
import type { GameDisplayTemplateSourceData } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import type { GameChallengeId } from "../../../entities/data/GameChallengeData";
import type {
  GameChallengeAnswer,
  GameChallengeAnswerValidation,
  GameChallengeSolution,
} from "../../../entities/data/GameChallengeSolution";
import type { GameStageId } from "../../../entities/data/GameStageData";
import { isDefined } from "../../../util/ObjectUtils";
import type { GameAnswerFunction } from "../Game";
import type { LayerHint } from "./GameDisplayComponent";
import GameDisplayTemplateComponent from "./GameDisplayTemplateComponent";

interface GameDisplayScrollComponentProps {
  templateSource?: GameDisplayTemplateSourceData;
  containerStyle?: React.CSSProperties;
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

  const [input, setInput] = useState<string>("");
  const [validations, setValidations] = useState<GameChallengeAnswerValidation[]>([]);
  const [solved, setSolved] = useState<boolean>(false);

  const submitAnswer = useCallback(
    (answer: GameChallengeAnswer) => {
      if (!isDefined(onAnswer)) {
        throw new Error("No onAnswer handler defined.");
      }
      if (!isDefined(stageId) || !isDefined(challengeId)) {
        throw new Error(`Stage id (${stageId}) and challenge id (${challengeId}) must be defined to submit an answer.`);
      }
      const validation = onAnswer(stageId, challengeId, answer);
      setSolved(validation === true);
      setValidations(validation === true ? [] : validation);
    },
    [onAnswer, stageId, challengeId],
  );

  useEffect(() => {
    if (isDefined(onAnswer)) {
      if (solution?.autoAccept ?? true) {
        submitAnswer(input);
      }
    }
  }, [input, solution, onAnswer, challengeId, stageId, submitAnswer]);

  const template =
    templateSource ??
    (layerHint === "foreground"
      ? ({
          sourceType: "embedded",
          content: "{{text}}",
        } as GameDisplayTemplateSourceData)
      : ({
          sourceType: "embedded",
          content: "<!-- scroll -->",
        } as GameDisplayTemplateSourceData));

  const templateStyle: CSSProperties =
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
          padding: "60px",
          ...containerStyle,
        }
      : {
          backgroundImage: `url(${oldPaperImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          ...containerStyle,
        };

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
            containerStyle={templateStyle}
            templateData={{ text: scrollData.text, ...templateData }}
            solution={solution}
            onAnswer={onAnswer}
          >
            {layerHint === "foreground" && scrollData.showInput && (
              <>
                <p>
                  {scrollData.label}
                  <br />
                  <input
                    type="text"
                    disabled={solved}
                    style={{
                      width: "80%",
                      textTransform: "uppercase",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                </p>
                {validations.length > 0 && (
                  <ul style={{ color: "red" }}>
                    {validations.map((v, i) => (
                      <li key={`validation-${i}`}>{v}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </GameDisplayTemplateComponent>
        </div>
      )}
    </>
  );
}
