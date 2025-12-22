import { useState, type CSSProperties, type ReactNode } from "react";
import type { CameraModuleData } from "../../entities/data/GameModuleData";
import { isDefined } from "../../util/ObjectUtils";
import CameraDebugOverlay from "../camera/CameraDebugOverlay";
import type { FeetPositions } from "../camera/CameraSupport";
import CharacterCamera from "../camera/CharacterCamera";
import CharacterCanvas from "../camera/CharacterCanvas";

interface GameLayersLayoutProps {
  backgroundStyle?: React.CSSProperties;
  backgroundLayer: ReactNode;
  foregroundLayer: ReactNode;
  cameraLayer: CameraModuleData | undefined;
  debug?: boolean;
}

export default function GameLayersLayout({
  backgroundStyle,
  backgroundLayer,
  foregroundLayer,
  cameraLayer,
  debug,
}: GameLayersLayoutProps) {
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "stretch",
    pointerEvents: "none", // allow clicks to pass through
  };

  const innerStyle: CSSProperties = {
    aspectRatio: aspect,
    width: isDefined(aspect) ? "auto" : "100%",
    height: "100%",
    overflow: "hidden",
  };

  const backgroundContainerStyle: CSSProperties = {
    ...innerStyle,
    ...backgroundStyle,
  };

  const characterCanvasStyle: CSSProperties = {
    transform: "scaleX(-1)",
    ...innerStyle,
  };

  const foregroundContainerStyle: CSSProperties = {
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
    pointerEvents: "none",
    display: debug ? "block" : "none",
  };

  const show = cameraLayer?.enabled === false || isDefined(aspect);

  return (
    <>
      {cameraLayer?.enabled === true && (
        <div style={{ ...characterCameraStyle, zIndex: 5 }} id="character-camera-layer">
          <CharacterCamera
            video={video}
            setVideo={setVideo}
            stream={characterStream}
            setStream={setCharacterStream}
            setAspect={setAspect}
            colorKey={debug === true}
          />
        </div>
      )}
      {show && (
        <>
          <div style={{ ...outerStyle, zIndex: 1 }}>
            <div style={backgroundContainerStyle} id="background-layer">
              {backgroundLayer}
            </div>
          </div>
          {cameraLayer?.enabled === true && (
            <div style={{ ...outerStyle, zIndex: 2 }}>
              <CharacterCanvas
                video={video}
                mediaStream={characterStream}
                canvasStyle={characterCanvasStyle}
                onFeetPositionsChange={setFeetPositions}
                maskType={debug ? "colored" : "binary"}
              />
            </div>
          )}
          <div style={{ ...outerStyle, zIndex: 3 }}>
            <div style={foregroundContainerStyle} id="foreground-layer">
              {foregroundLayer}
            </div>
          </div>
          {debug && (
            <div style={{ ...outerStyle, zIndex: 4 }} id="debug-overlay-layer">
              {cameraLayer?.enabled === true && (
                <CameraDebugOverlay style={debugOverlayStyle} feetPositions={feetPositions} />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
