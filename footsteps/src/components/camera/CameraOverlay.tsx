import { useEffect, useRef, useState } from "react";
import { isDefined } from "../../util/ObjectUtils";
import { getCameraStream } from "./CameraSupport";
import CharacterOverlay, { type FeetPositions } from "./CharacterOverlay";

export default function CameraOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [display, setDisplay] = useState<HTMLDivElement | null>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [feetPositions, setFeetPositions] = useState<FeetPositions>();
  // const [scale, setScale] = useState<{ x: number; y: number }>();
  // const videoAvailable = isDefined(video);

  useEffect(() => {
    setVideo(videoRef.current);
  }, [videoRef]);

  useEffect(() => {
    setDisplay(displayRef.current);
  }, [displayRef]);

  useEffect(() => {
    if (video && !stream) {
      getCameraStream().then((mediaStream) => {
        setStream(mediaStream);
        videoRef.current!.srcObject = mediaStream;
        videoRef.current!.play();
      });
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [video, stream]);

  const DebugData = ({ color }: { color: string }) => {
    return (
      <div>
        <p style={{ color: color }}>
          feetPositions: {isDefined(feetPositions) ? JSON.stringify(feetPositions) : "undefined"}
        </p>
      </div>
    );
  };

  return (
    <>
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          right: "2vw",
          top: "2vh",
          width: "12vw",
          height: "auto",
          border: "solid 2px grey",
          transform: "scaleX(-1)",
        }}
        autoPlay
        playsInline
      />
      <div
        ref={displayRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "stretch",
        }}
      >
        {/* <DebugData color="white" /> */}

        {isDefined(video) && isDefined(display) && stream && (
          <CharacterOverlay
            video={video}
            mediaStream={stream}
            style={{ height: "100%", overflow: "hidden" }}
            onFeetPositionsChange={setFeetPositions}
          >
            {isDefined(feetPositions) &&
              Object.values(feetPositions).map((pos, i) => (
                <div
                  key={`foot-marker-${i}`}
                  style={{
                    position: "absolute",
                    left: `${pos.percent.x}%`,
                    top: `${pos.percent.y}%`,
                    width: "40px",
                    height: "40px",
                    backgroundColor: "cyan",
                    borderRadius: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
          </CharacterOverlay>
        )}
      </div>
    </>
  );
}
