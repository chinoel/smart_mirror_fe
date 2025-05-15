"use client";
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';

interface GestureRecognitionProps {
    videoStream?: MediaStream;
}

const GestureRecognition = ({ videoStream }: GestureRecognitionProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const handposeModelRef = useRef<any>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [prediction, setPrediction] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const detectingRef = useRef(false);
    const modelLoadedRef = useRef(false);

    // TensorFlow.js 초기화 및 모델 로드
    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            try {
                // TensorFlow.js 초기화
                if (!tf.getBackend()) {
                    await tf.setBackend('webgl');
                }
                await tf.ready();
                console.log('TensorFlow.js initialized with backend:', tf.getBackend());

                // 모델 로드
                if (!modelLoadedRef.current) {
                    console.log('Loading handpose model...');
                    handposeModelRef.current = await handpose.load({
                        maxContinuousChecks: 5,
                        detectionConfidence: 0.8,
                    });
                    console.log('Handpose model loaded');

                    console.log('Loading gesture model...');
                    const gestureModel = await tf.loadLayersModel('indexeddb://gesture-model');
                    console.log('Gesture model loaded');
                    console.log('Model summary:', gestureModel.summary()); // 모델 구조 확인

                    const savedLabels = localStorage.getItem('gestureLabels');
                    if (savedLabels) {
                        const parsedLabels = JSON.parse(savedLabels);
                        console.log('Loaded labels:', parsedLabels); // 로드된 라벨 확인
                        if (isMounted) {
                            setLabels(parsedLabels);
                            setModel(gestureModel);
                            modelLoadedRef.current = true;
                            setIsLoading(false);
                        }
                    } else {
                        throw new Error('No labels found');
                    }
                }
            } catch (err) {
                console.error('Initialization error:', err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to initialize');
                    setIsLoading(false);
                }
            }
        };

        initialize();

        return () => {
            isMounted = false;
            if (model) {
                model.dispose();
            }
            detectingRef.current = false;
        };
    }, []);

    // 비디오 스트림 설정
    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
            console.log("Video stream set to video element");

            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play();
                console.log("Video metadata loaded");
            };

            videoRef.current.onloadeddata = () => {
                console.log('Video stream loaded completely');
                console.log('Video dimensions:', {
                    width: videoRef.current?.videoWidth,
                    height: videoRef.current?.videoHeight,
                    readyState: videoRef.current?.readyState
                });

                // 모델과 비디오가 모두 준비되었는지 확인
                if (modelLoadedRef.current) {
                    console.log('Starting detection loop...');
                    detectingRef.current = true;
                    detect();
                } else {
                    console.log('Model not yet loaded');
                }
            };
        } else {
            console.log("Video ref or stream not available:", {
                videoRef: !!videoRef.current,
                videoStream: !!videoStream
            });
        }
    }, [videoStream]);

    const detect = async () => {
        if (!videoRef.current || !handposeModelRef.current || !detectingRef.current || !model) {
            console.log("Detection conditions not met:", {
                video: !!videoRef.current,
                videoReady: videoRef.current?.readyState === 4,
                handpose: !!handposeModelRef.current,
                detecting: detectingRef.current,
                model: !!model
            });
            return;
        }

        try {
            console.log("Attempting hand detection...");
            const hands = await handposeModelRef.current.estimateHands(videoRef.current);
            console.log("Hand detection completed, hands found:", hands.length);

            if (hands.length > 0) {
                const landmarks = hands[0].landmarks.flat();
                console.log("Landmarks extracted:", landmarks.length);

                // 제스처 예측
                tf.tidy(() => {
                    try {
                        const inputTensor = tf.tensor2d([landmarks]);
                        const prediction = model!.predict(inputTensor) as tf.Tensor;
                        const probabilities = prediction.dataSync();

                        const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
                        const predictedGesture = labels[maxProbIndex];
                        const confidence = probabilities[maxProbIndex];

                        console.log({
                            gesture: predictedGesture,
                            confidence: confidence,
                            probabilities: Array.from(probabilities)
                        });

                        if (confidence > 0.7) {
                            setPrediction(predictedGesture);
                        }
                    } catch (err) {
                        console.error("Prediction error:", err);
                    }
                });
            }
        } catch (err) {
            console.error('Detection error:', err);
        }

        // 다음 프레임 요청
        if (detectingRef.current) {
            requestAnimationFrame(detect);
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
                    opacity: 1, // 비디오가 보이도록 수정
                    transform: 'scaleX(-1)',
                    objectFit: 'cover'
                }}
            />
            {prediction && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                    감지된 제스처: {prediction}
                </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                상태: {isLoading ? "로딩 중" : "준비됨"}
            </div>
        </div>
    );
};

export default GestureRecognition;