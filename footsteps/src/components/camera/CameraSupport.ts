export const getCameraStream = async (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    return stream;
  } catch (err) {
    console.error("Error accessing the camera: ", err);
    throw err;
  }
};
