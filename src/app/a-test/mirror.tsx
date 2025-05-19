// Mirror.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js'
import '@/styles/faceApp.css'
import { useMirror } from "@/app/context/MirrorContext";
import { useTensorFlow } from "@/app/context/TensorFlowContext";
import { useVideo } from "../context/SharedVideoContext";

export default function Mirror() {
    const { isInitialized } = useTensorFlow();
    const { stream } = useVideo();
    const { mirrorMode, setMirrorMode, setNotification } = useMirror();
    const [isDetecting, setIsDetecting] = useState(false);

    const { videoRef } = useVideo();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const dataSend = async (data: any) => {
        console.log('dataSend', data);
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
            console.log('Face detection models loaded');
            setIsDetecting(true);
            faceMyDetect();
        } catch (err) {
            console.error('Error loading face detection models:', err);
        }
    }

    // Detect the face (얼굴 감지)
    const faceMyDetect = async () => {
        if (!isDetecting || !videoRef.current) return;

        try {
            const detections = await faceapi.detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceDescriptors()
            .withFaceExpressions();

            const canvas = canvasRef.current;
            if (canvas) {
                const displaySize = {
                    width: videoRef.current.width,
                    height: videoRef.current.height
                }
                faceapi.matchDimensions(canvas, displaySize);

                const resizedDetections = faceapi.resizeResults(
                    detections, displaySize
                );

                const context = canvas.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                }

                if (resizedDetections.length > 0) {
                    const faceDescriptors = resizedDetections.map(detection => ({
                        descriptor: Array.from(detection.descriptor),
                        expressions: detection.expressions
                    }));

                    dataSend(faceDescriptors);
                    setNotification('얼굴이 감지되었습니다.');
                    setMirrorMode(1);
                } else {
                    setNotification('');
                    setMirrorMode(0);
                }
            }
        } catch (err) {
            console.error('Face detection error:', err);
        }

        if (isDetecting) {
            detectionIntervalRef.current = setTimeout(faceMyDetect, 100);
        }
    }

    useEffect(() => {
        if (!isInitialized || !stream || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        loadModels();

        return () => {
            setIsDetecting(false);
            if (detectionIntervalRef.current) {
                clearTimeout(detectionIntervalRef.current);
            }
        };
    }, [isInitialized, stream]);

    return (
        <div className="faceApp">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="940"
                height="650"
                style={{
                    position: 'absolute',
                    opacity: 0
                }}
            />
            <canvas
                ref={canvasRef}
                width="940"
                height="650"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />
        </div>
    );
}