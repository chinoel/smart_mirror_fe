"use client";
import { useEffect, useRef } from "react";
import * as faceapi from 'face-api.js'
import '@/styles/faceApp.css'
import { useMirror } from "@/app/context/MirrorContext";

export default function Mirror() {
    const { mirrorMode, setMirrorMode, setNotification } = useMirror();

    const videoRef = useRef<HTMLVideoElement>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null!);

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

    const dataSend = async (data: any) => {
        try {
            const response = await fetch('http://localhost:5000/homes/usercheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // return 값 확인
            const result = await response.json();
            console.log(result);
        }
        catch (err) {
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
                        dataSend(resizedDetections)
                        setNotification('얼굴이 감지되었습니다.')
                        setMirrorMode(1)
                    }
                    else {
                        setNotification('')
                        setMirrorMode(0)
                    }
                }
            }, 5000) // time
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        initCamera();
        loadModels();
    }, [])


    return (
        <div className="faceApp">
            <video ref={videoRef} autoPlay playsInline width="940" height="650" style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} width="940" height="650" style={{ display: 'none' }} />
        </div>
    );
}