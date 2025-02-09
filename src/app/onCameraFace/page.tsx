"use client";
import { useEffect, useRef } from "react";
import '@/styles/faceApp.css'
import { vectorTask } from "@/services/faceApi/vectorTask";


export default function CameraFace() {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    vectorTask(videoRef, canvasRef);
  }, [])

  return (
    <div className="myapp">
      <h1>Face Detection</h1>

      <div className="appvide">
        <video ref={videoRef} autoPlay playsInline
          width="940" height="650"></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650"
        className="appcanvas"
      />
    </div>
  );
}