// GestureRecognition.tsx
"use client";
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { useTensorFlow } from '@/app/context/TensorFlowContext';
import { useVideo } from '../context/SharedVideoContext';

const GestureRecognition = () => {
    const { isInitialized } = useTensorFlow();
    const { stream } = useVideo();
    const { videoRef } = useVideo();  // 공유 비디오 참조 사용

    const handposeModelRef = useRef<any>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [prediction, setPrediction] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const detectingRef = useRef(false);
    const [fps, setFps] = useState(0);
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFPS = () => {
        const now = performance.now();
        const delta = now - lastTime;
        frameCount++;

        if (delta >= 1000) {
            setFps(Math.round((frameCount * 1000) / delta));
            frameCount = 0;
            lastTime = now;
        }
    };

    useEffect(() => {
        if (!isInitialized) return;

        const loadModels = async () => {
            try {
                await tf.engine().startScope();
                console.log("Loading handpose model...");
                handposeModelRef.current = await handpose.load();
                console.log("Handpose model loaded");

                console.log("Loading gesture model...");
                const gestureModel = await tf.loadLayersModel('indexeddb://gesture-model');
                setModel(gestureModel);

                const savedLabels = localStorage.getItem('gestureLabels');
                if (savedLabels) {
                    setLabels(JSON.parse(savedLabels));
                } else {
                    throw new Error('No labels found');
                }

                setIsLoading(false);
                detectingRef.current = true;
                requestAnimationFrame(detect);
            } catch (err) {
                console.error('Model loading error:', err);
                setError(err instanceof Error ? err.message : 'Failed to load models');
            } finally {
                tf.engine().endScope();
            }
        };

        loadModels();

        return () => {
            detectingRef.current = false;
            if (model) {
                model.dispose();
            }
        };
    }, [isInitialized]);

    useEffect(() => {
        if (!stream || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.play();
    }, [stream]);

    const detect = async () => {
        if (!detectingRef.current || !videoRef.current || !handposeModelRef.current || !model) return;

        await tf.engine().startScope();
        try {
            updateFPS();
            const hands = await handposeModelRef.current.estimateHands(videoRef.current);

            if (hands.length > 0) {
                const landmarks = hands[0].landmarks.flat();
                
                const inputTensor = tf.tensor2d([landmarks]);
                const prediction = model.predict(inputTensor) as tf.Tensor;
                const probabilities = await prediction.data();
                const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));

                if (probabilities[maxProbIndex] > 0.7) {
                    setPrediction(labels[maxProbIndex]);
                }

                inputTensor.dispose();
                prediction.dispose();
            }
        } catch (err) {
            console.error('Detection error:', err);
        } finally {
            tf.engine().endScope();
            if (detectingRef.current) {
                setTimeout(() => requestAnimationFrame(detect), 100);
            }
        }
    };

    if (isLoading) {
        return <div>Loading models...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="relative">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="940"
                height="650"
                style={{
                    position: 'absolute',
                    opacity: 0,
                    transform: 'scaleX(-1)'
                }}
            />
            {prediction && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                    감지된 제스처: {prediction}
                </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                FPS: {fps}
            </div>
        </div>
    );
};

export default GestureRecognition;