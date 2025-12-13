import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { getCameraStream } from "./CameraSupport";

interface CharacterCameraProps {
  stream: MediaStream | undefined;
  setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
  video: HTMLVideoElement | null;
  setVideo: Dispatch<SetStateAction<HTMLVideoElement | null>>;
  setAspect: Dispatch<SetStateAction<number | undefined>>;
}

export default function CharacterCamera({ stream, setStream, video, setVideo, setAspect }: CharacterCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideo(videoRef.current);
  }, [setVideo, videoRef]);

  useEffect(() => {
    if (video && !stream) {
      getCameraStream().then((mediaStream) => {
        setStream(mediaStream);
        videoRef.current!.srcObject = mediaStream;
        videoRef.current!.play().then(() => {
          setAspect(video.videoWidth / video.videoHeight);
        });
      });
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [video, stream, setStream, setAspect]);

  return (
    <video
      ref={videoRef}
      style={{
        width: "12vw",
        height: "auto",
      }}
      autoPlay
      playsInline
    />
  );
}
