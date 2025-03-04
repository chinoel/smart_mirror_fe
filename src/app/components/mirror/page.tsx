"use client";
import { useEffect, useRef } from "react";
import * as faceapi from 'face-api.js'
import '@/styles/faceApp.css'


export default function Mirror() {
    const videoRef = useRef<HTMLVideoElement>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    // Initialize the camera (카메라 초기화)
    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Load the models (모델 로드)
    const loadModels = async () => {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ]);
            faceMyDetect();
        } catch (err) {
            console.error(err)
        }
    }

    // Detect the face (얼굴 감지)
    const faceMyDetect = async () => {
        try {
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current!,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks().withFaceExpressions()

                const canvas = canvasRef.current;
                if (canvas) {
                    const displaySize = {
                        width: videoRef.current!.width,
                        height: videoRef.current!.height
                    }
                    faceapi.matchDimensions(canvas, displaySize);

                    const resizedDetections = faceapi.resizeResults(
                        detections, displaySize
                    );

                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.getContext('2d')?.clearRect(0, 0,
                            canvas.width, canvas.height)
                        faceapi.draw.drawDetections(canvas, resizedDetections);
                        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                    }

                    if (resizedDetections.length > 0) {
                        console.log(resizedDetections)
                    }
                }
            }, 10000) // time
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        initCamera();
        loadModels();
    }, [])


    return (
        <div className="myapp">
            <video ref={videoRef} autoPlay playsInline width="940" height="650" style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} width="940" height="650" style={{ display: 'none' }} />
        </div>
    );
}