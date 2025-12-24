import { useState, type CSSProperties, type ReactNode } from "react";
import type { CameraModuleData } from "../../entities/data/GameModuleData";
import { isDefined } from "../../util/ObjectUtils";
import CameraDebugOverlay from "../camera/CameraDebugOverlay";
import type { FeetPositions } from "../camera/CameraSupport";
import CharacterCamera from "../camera/CharacterCamera";
import CharacterCanvas from "../camera/CharacterCanvas";
import "./GameLayersLayout.css";
import HeadsUpDisplay from "./HeadsUpDisplay";

interface GameLayersLayoutProps {
  inheritedBackgroundLayer?: ReactNode;
  inheritedBackgroundStyle?: CSSProperties;
  backgroundLayer: ReactNode;
  foregroundLayer: ReactNode;
  cameraLayer: CameraModuleData | undefined;
  debug?: boolean;
  onElementClick?: (layerId: string, targetId: string) => void;
}

export default function GameLayersLayout({
  inheritedBackgroundStyle,
  inheritedBackgroundLayer,
  backgroundLayer,
  foregroundLayer,
  cameraLayer,
  debug,
  onElementClick,
}: GameLayersLayoutProps) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [characterStream, setCharacterStream] = useState<MediaStream | undefined>(undefined);
  const [feetPositions, setFeetPositions] = useState<FeetPositions>({});
  const [aspect, setAspect] = useState<number>();

  /**
   * Handles clicks on the clickable layers.
   * @param event a javascript event raised by the click
   */
  const clickHandler = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    layerIdOverride?: string,
    stopPropagationOnId: boolean = true,
  ) => {
    const targetId = (event.target as HTMLElement).id;
    const layerId = isDefined(layerIdOverride) ? layerIdOverride : event.currentTarget.id;
    if (isDefined(onElementClick) && targetId) {
      onElementClick(layerId, targetId);
      if (stopPropagationOnId) {
        event.stopPropagation();
      }
    }
  };

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
  };

  const innerStyle: CSSProperties = {
    aspectRatio: aspect,
    width: isDefined(aspect) ? "auto" : "100%",
    height: "100%",
    overflow: "hidden",
  };

  const inheritedBackgroundContainerStyle: CSSProperties = {
    ...outerStyle,
    ...inheritedBackgroundStyle,
    zIndex: 100,
  };

  const backgroundContainerStyle: CSSProperties = {
    ...outerStyle,
    zIndex: 101,
  };

  const characterCanvasContainerStyle: CSSProperties = {
    ...outerStyle,
    zIndex: 200,
  };

  const characterCanvasStyle: CSSProperties = {
    transform: "scaleX(-1)",
    ...innerStyle,
  };

  const foregroundLayerContainerStyle: CSSProperties = {
    ...outerStyle,
    zIndex: 300,
  };

  const foregroundLayerStyle: CSSProperties = {
    ...innerStyle,
  };

  const debugOverlayContainerStyle: CSSProperties = {
    ...outerStyle,
    zIndex: 400,
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
    zIndex: 500,
  };

  const hudLayerContainerStyle: CSSProperties = {
    zIndex: 600,
    position: "absolute",
    bottom: 0,
    left: 0,
  };

  const show = cameraLayer?.enabled === false || isDefined(aspect);

  return (
    <>
      {cameraLayer?.enabled === true && (
        <div style={characterCameraStyle} id="character-camera-layer">
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
          <div id={`inherited-background-layer-container`} style={inheritedBackgroundContainerStyle}>
            {inheritedBackgroundLayer}
          </div>

          <div id={`background-layer-container`} style={backgroundContainerStyle}>
            {backgroundLayer}
          </div>

          {cameraLayer?.enabled === true && (
            <div id="character-canvas-container" style={characterCanvasContainerStyle}>
              <CharacterCanvas
                video={video}
                mediaStream={characterStream}
                canvasStyle={characterCanvasStyle}
                onFeetPositionsChange={setFeetPositions}
                maskType={debug ? "colored" : "binary"}
              />
            </div>
          )}
          <div id="foreground-layer-container" style={foregroundLayerContainerStyle}>
            <div
              style={foregroundLayerStyle}
              id="foreground-layer"
              onClick={(event) => clickHandler(event, "foreground-layer")}
            >
              {foregroundLayer}
            </div>
          </div>
          {debug && (
            <div
              style={debugOverlayContainerStyle}
              id="debug-overlay-container"
              onClick={(event) => clickHandler(event, undefined, false)}
            >
              {cameraLayer?.enabled === true && (
                <CameraDebugOverlay style={debugOverlayStyle} feetPositions={feetPositions} />
              )}
            </div>
          )}
          <div id="hud-layer-container" style={hudLayerContainerStyle}>
            <HeadsUpDisplay />
          </div>
        </>
      )}
    </>
  );
}
