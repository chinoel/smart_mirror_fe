"use client";

import { useEffect, useRef } from "react";
import * as handpose from "@mediapipe/hands";
import "@tensorflow/tfjs-backend-webgl";

const HandGestureCapture = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const hands = new handpose.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });


    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");


    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        videoRef.current.onloadeddata = () => {
          if (canvas && videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
          }
        };
      }
    };



    const detectHandGestures = async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && canvas && ctx) {
        await hands.send({ image: videoRef.current });
      }
      requestAnimationFrame(detectHandGestures);
    };

    hands.onResults((handsResults) => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (handsResults.multiHandLandmarks) {
          handsResults.multiHandLandmarks.forEach((handLandmarks) => {
            drawHandLandmarks(ctx, handLandmarks);
          });
        }
      }
    });



    const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: handpose.NormalizedLandmark[]) => {
      ctx.beginPath();
      landmarks.forEach((landmark) => {
        const { x, y } = landmark;
        if (canvas) {
          ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
        }
        ctx.fillStyle = "red";
        ctx.fill();
      });
    };

    startVideo().then(() => {
      detectHandGestures();
    });

    return () => {
      hands.close();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default HandGestureCapture;
