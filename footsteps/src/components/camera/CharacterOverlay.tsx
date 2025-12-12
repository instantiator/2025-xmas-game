import * as bodySeg from "@tensorflow-models/body-segmentation";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState, type CSSProperties, type PropsWithChildren } from "react";
import { findFeet, type FootPosition } from "./CameraSupport";

// Define a type for the loaded model network
type BodySegNet = bodySeg.BodySegmenter;

export type FeetPositions = {
  [personId: number]: FootPosition;
};

interface CharacterOverlayProps {
  video: HTMLVideoElement;
  mediaStream: MediaStream;
  style?: CSSProperties;
  onFeetPositionsChange?: (feetPositions: FeetPositions) => void;
}

export default function CharacterOverlay({
  video,
  mediaStream,
  style,
  onFeetPositionsChange,
  children,
}: PropsWithChildren<CharacterOverlayProps>) {
  const [net, setNet] = useState<BodySegNet | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      // Wait for TensorFlow.js to be ready
      await tf.ready();

      // Load the BodyPix model with ResNet50 arch for higher accuracy
      const modelConfig: bodySeg.BodyPixModelConfig = {
        architecture: "ResNet50", // alternative: ResNet50 (needs multiplier 1.0)
        outputStride: 32, // Higher stride can improve accuracy
        multiplier: 1.0, // Use 1.0 for ResNet50
        quantBytes: 4, // Higher precision
      };

      try {
        console.log("Loading BodySeg model...");
        const bodySegNet = await bodySeg.createSegmenter(bodySeg.SupportedModels.BodyPix, modelConfig);
        setNet(bodySegNet);
        console.log("Model loaded successfully!");
      } catch (error) {
        console.error("Failed to load BodySeg model:", error);
      }
    };

    const unloadModel = async () => {
      net?.dispose();
      setNet(null);
    };

    if (mediaStream && !net) {
      loadModel();
    }
    if (!mediaStream) {
      unloadModel();
    }
  }, [mediaStream, net]);

  // Process the video stream
  useEffect(() => {
    // The actual segmentation and rendering loop
    const runSegmentationLoop = (net: BodySegNet, video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const segmentFrame = async () => {
        const segmentation = await net.segmentPeople(video, {
          internalResolution: "high", // Adjust resolution for performance
          flipHorizontal: true, // Often needed for webcams
          segmentationThreshold: 0.65, // Confidence threshold
        });

        if (segmentation.length === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (onFeetPositionsChange) {
            onFeetPositionsChange({});
          }
          requestAnimationFrame(segmentFrame);
          return;
        }

        // 1. Find the feet positions
        if (onFeetPositionsChange) {
          const feetPositions: FeetPositions = {};
          for (let i = 0; i < segmentation.length; i++) {
            const person = segmentation[i];
            const personMask = await bodySeg.toBinaryMask(
              [person],
              { r: 0, g: 0, b: 0, a: 255 },
              { r: 0, g: 0, b: 0, a: 0 },
            );

            const feet = findFeet(personMask, personMask.width, personMask.height, false);
            if (feet) {
              feetPositions[i] = feet;
            }
          }
          onFeetPositionsChange(feetPositions);
        }

        // 2. Create the mask for background removal
        const foregroundColor = { r: 0, g: 0, b: 0, a: 255 }; // Opaque black
        const backgroundColor = { r: 0, g: 0, b: 0, a: 0 }; // Transparent
        const backgroundMask = await bodySeg.toBinaryMask(segmentation, foregroundColor, backgroundColor);

        // 3. Draw the masked result to the canvas
        if (ctx) {
          const maskBitmap = await createImageBitmap(backgroundMask);
          ctx.save();
          // Draw the video
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Use 'destination-in' to keep only the part of the video that overlaps with the mask
          ctx.globalCompositeOperation = "destination-in";
          // Draw the mask
          ctx.drawImage(maskBitmap, 0, 0, canvas.width, canvas.height);
          // Restore composite operation
          ctx.restore();
        }

        // Request next frame for continuous real-time processing
        requestAnimationFrame(segmentFrame);
      };

      // Start the loop
      segmentFrame();
    };

    if (net && mediaStream) {
      runSegmentationLoop(net, video, canvasRef.current!);
      return () => {
        mediaStream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [net, mediaStream, video, onFeetPositionsChange]);

  const containerStyle: CSSProperties = {
    ...style,
    transform: "scaleX(-1)", // mirror the canvas
  };

  return (
    <>
      {!net && <p style={{ color: "white" }}>Loading...</p>}
      <div style={containerStyle}>
        {children}
        {net && <canvas ref={canvasRef} style={{ height: "100%", width: "auto" }} />}
      </div>
    </>
  );
}
