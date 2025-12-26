// import { useReward } from "partycles";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import metadata from "../../../assets/resources/assets-metadata.json";
import oldPaperImage from "../../../assets/resources/old-paper.png";
import type { GameDisplayScrollComponentData } from "../../../entities/data/displays/GameDisplayScrollComponentData";
import type { GameDisplayTemplateSourceData } from "../../../entities/data/displays/GameDisplayTemplateComponentData";
import type { GameChallengeId } from "../../../entities/data/GameChallengeData";
import type {
  GameChallengeAnswer,
  GameChallengeAnswerValidation,
  GameChallengeSolution,
} from "../../../entities/data/GameChallengeSolution";
import type { GameStageId } from "../../../entities/data/GameStageData";
import { useGameData } from "../../../providers/GameDataHook";
import { isDefined } from "../../../util/ObjectUtils";
import type { GameAnswerFunction } from "../Game";
import { parseLines } from "../logic/TemplateUtils";
import type { LayerHint } from "./GameDisplayComponent";
import GameDisplayTemplateComponent from "./GameDisplayTemplateComponent";

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
  const { resources } = useGameData();

  // const { reward } = useReward(`input-${stageId}-${challengeId}`, "confetti");

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
      // if (validation === true) {
      //   reward();
      // }
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
            paddingLeft: "60px",
            paddingRight: "50px",
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

  // media handling
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const handlePlay = () => setMediaPlaying(true);
  const handlePause = () => setMediaPlaying(false);

  // reward
  // useEffect(() => {
  //   if (solved) {
  //     reward();
  //   }
  // }, [solved, reward]);

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
            {layerHint === "foreground" && isDefined(scrollData.media) && scrollData.media.type === "audio" && (
              <>
                {!mediaPlaying && isDefined(scrollData.media.stillImageResource) && (
                  <img
                    src={resources[scrollData.media.stillImageResource]}
                    alt="Audio not playing"
                    style={{
                      height: "15vh",
                      margin: "10px",
                      animation: "floatAndZoom 3s ease-in-out infinite alternate",
                      filter: "drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.5))",
                    }}
                    onClick={() => {
                      if (isDefined(audioRef.current)) {
                        audioRef.current.play();
                      }
                    }}
                  />
                )}
                {mediaPlaying && isDefined(scrollData.media.motionImageResource) && (
                  <img
                    src={resources[scrollData.media.motionImageResource]}
                    alt="Audio playing"
                    style={{
                      height: "15vh",
                      margin: "10px",
                      animation: "floatAndZoom 3s ease-in-out infinite alternate",
                      filter: "drop-shadow(8px 8px 10px rgba(0, 0, 0, 0.5))",
                    }}
                    onClick={() => {
                      if (isDefined(audioRef.current)) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                    }}
                  />
                )}
                <audio
                  ref={audioRef}
                  key={`audio-${scrollData.media.resource}`}
                  controls
                  style={{ margin: "10px", opacity: 0.25 }}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handlePause}
                >
                  <source src={resources[scrollData.media.resource]} />
                  Your browser does not support the audio element.
                </audio>
              </>
            )}

            {layerHint === "foreground" && scrollData.showInput && (
              <>
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  {/* {solved && <Sparkle />} */}
                  {scrollData.label && <p>{scrollData.label}</p>}
                  <input
                    id={`input-${stageId}-${challengeId}`}
                    type="text"
                    disabled={solved}
                    style={{
                      width: "90%",
                      textTransform: "uppercase",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                    }}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                </div>
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
