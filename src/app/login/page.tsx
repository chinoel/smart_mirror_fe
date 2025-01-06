"use client";
import { useEffect, useRef } from "react";
import * as faceapi from 'face-api.js'

export default function Login() {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, [])

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    }

    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(() => {
        faceMyDetect()
      })
    }

    const faceMyDetect = () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        }
        faceapi.matchDimensions(canvasRef.current, {
          width: 940,
          height: 650
        })

        const resized = faceapi.resizeResults(detections, {
          width: 940,
          height: 650
        })

        faceapi.draw.drawDetections(canvasRef.current, resized)
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
        faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
      }, 10000)
    }

  return (
    <>
      <h1>Face Detection</h1>
      <video crossOrigin='anonymous' ref={videoRef}></video>

      <canvas ref={canvasRef} width="940" height="650"
      className='appcanvas' />
    </>
  );
}