import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundRemover from "./BackgroundRemover";
import { getCameraStream } from "./CameraSupport";

export default function CameraOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<HTMLVideoElement>();
  const [stream, setStream] = useState<MediaStream>();

  const initCamera = useCallback(async () => {
    const newStream = await getCameraStream(videoRef);
    setVideo(videoRef.current!);
    setStream(newStream);
  }, []);

  useEffect(() => {
    initCamera();
  }, [initCamera]);

  return (
    // ,
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // border: "solid 4px green",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          left: "2vh",
          bottom: "2vh",
          width: "12vw",
          height: "auto",
          border: "solid 2px grey",
        }}
        autoPlay
        playsInline
      />
      {video && stream && <BackgroundRemover video={video} mediaStream={stream} />}
    </div>
  );
}
