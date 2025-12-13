import { useState, type CSSProperties, type ReactNode } from "react";
import { isDefined } from "../../util/ObjectUtils";
import type { FeetPositions } from "../camera/CameraSupport";
import CharacterCamera from "../camera/CharacterCamera";
import CharacterCanvas from "../camera/CharacterCanvas";

interface GameLayersLayoutProps {
  backgroundStyle?: React.CSSProperties;
  backgroundLayer: ReactNode;
  foregroundLayer: ReactNode;
}

export default function GameLayersLayout({ backgroundStyle, backgroundLayer, foregroundLayer }: GameLayersLayoutProps) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [characterStream, setCharacterStream] = useState<MediaStream | undefined>(undefined);
  const [feetPositions, setFeetPositions] = useState<FeetPositions>({});
  const [aspect, setAspect] = useState<number>();

  const outerStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    // border: "solid 8px black",
    pointerEvents: "none", // allow clicks to pass through
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "stretch",
  };

  const innerStyle: CSSProperties = {
    aspectRatio: aspect,
    width: "auto",
    height: "100%",
    overflow: "hidden",
  };

  const backgroundContainerStyle: CSSProperties = {
    // border: "solid 6px red",
    ...innerStyle,
    ...backgroundStyle,
  };

  const characterCanvasStyle: CSSProperties = {
    // border: "solid 4px green",
    transform: "scaleX(-1)",
    ...innerStyle,
  };

  const foregroundContainerStyle: CSSProperties = {
    // border: "solid 2px blue",
    ...innerStyle,
  };

  const debugOverlayStyle: CSSProperties = {
    transform: "scaleX(-1)",
    ...innerStyle,
  };

  const characterCameraStyle: CSSProperties = {
    position: "absolute",
    right: "2vw",
    top: "2vh",
    border: "solid 2px grey",
    transform: "scaleX(-1)",
  };

  return (
    <>
      <div style={{ ...characterCameraStyle, zIndex: 5 }} id="character-camera-layer">
        <CharacterCamera
          video={video}
          setVideo={setVideo}
          stream={characterStream}
          setStream={setCharacterStream}
          setAspect={setAspect}
        />
      </div>
      {isDefined(aspect) && (
        <>
          <div style={{ ...outerStyle, zIndex: 1 }}>
            <div style={backgroundContainerStyle} id="background-layer">
              {backgroundLayer}
            </div>
          </div>
          <div style={{ ...outerStyle, zIndex: 2 }}>
            <CharacterCanvas
              video={video}
              mediaStream={characterStream}
              canvasStyle={characterCanvasStyle}
              onFeetPositionsChange={setFeetPositions}
            />
          </div>
          <div style={{ ...outerStyle, zIndex: 3 }}>
            <div style={foregroundContainerStyle} id="foreground-layer">
              {foregroundLayer}
            </div>
          </div>
          <div style={{ ...outerStyle, zIndex: 4 }} id="debug-overlay-layer">
            <div style={debugOverlayStyle}>
              {isDefined(feetPositions) &&
                Object.values(feetPositions).map((pos, i) => (
                  <div
                    key={`foot-marker-${i}`}
                    style={{
                      position: "absolute",
                      left: `${pos.percent.x}%`,
                      top: `${pos.percent.y}%`,
                      width: "10px",
                      height: "10px",
                      backgroundColor: "lightgreen",
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
