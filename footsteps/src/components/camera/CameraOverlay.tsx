import { useCallback, useEffect, useRef } from "react";
import { getCameraStream } from "./CameraSupport";

export default function CameraOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const initCamera = useCallback(async () => {
    streamRef.current = await getCameraStream(videoRef);
  }, []);

  useEffect(() => {
    initCamera();
  }, [initCamera]);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "solid 4px green" }}>
      <div
        style={{
          position: "absolute",
          left: "2vw",
          top: "2vh",
          width: "8vw",
          height: "8vh",
          border: "solid 2px black",
        }}
      >
        <video ref={videoRef} style={{ width: "100%", height: "100%" }} autoPlay playsInline />
      </div>
    </div>
  );
}
