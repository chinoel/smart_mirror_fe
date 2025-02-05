import { RefObject } from 'react';
import * as faceapi from 'face-api.js';
import '@/styles/faceApp.css';

export const vectorTask = async (videoRef: RefObject<HTMLVideoElement>, canvasRef: RefObject<HTMLCanvasElement>) => {
    const initCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef && videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
        }
    }


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

    const faceMyDetect = async () => {
        try {
            setInterval(async () => {
                if (!videoRef.current) return;

                const detections = await faceapi.detectSingleFace(
                    videoRef.current!,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceLandmarks().withFaceDescriptor();

                const canvas = canvasRef.current;
                if (canvas) {
                    const displaySize = {
                        width: videoRef.current!.width,
                        height: videoRef.current!.height
                    };
                    faceapi.matchDimensions(canvas, displaySize);

                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
                    if (resizedDetections) {
                        faceapi.draw.drawDetections(canvas, resizedDetections);
                        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                    }

                    if (detections?.descriptor) {
                        const faceDescriptor = Array.from(detections.descriptor);
                        console.log("faceDescriptor", faceDescriptor);

                        // Back End Call
                    }
                }
            }, 1000)
        } catch (err) {
            console.error(err)
        }
    }

    initCamera();
    loadModels();
}