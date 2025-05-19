"use client";
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';

const GestureRecognition = () => {
    const webcamRef = useRef<Webcam>(null);
    const handposeModelRef = useRef<any>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [prediction, setPrediction] = useState<string>('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const detectingRef = useRef(false);
    const [fps, setFps] = useState(0);
    let frameCount = 0;
    let lastTime = performance.now();

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user",
    };

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

    const checkModelStatus = () => {
        console.log("모델 상태 체크:", {
            gestureModel: model ? "로드됨" : "로드되지 않음",
            handposeModel: handposeModelRef.current ? "로드됨" : "로드되지 않음",
            labels: labels.length > 0 ? "로드됨" : "로드되지 않음"
        });
    };

    useEffect(() => {
        const loadModels = async () => {
            setIsLoading(true);
            try {
                console.log("Handpose 모델 로딩 시작...");
                handposeModelRef.current = await handpose.load();
                console.log("Handpose 모델 로딩 완료!");

                console.log("제스처 모델 로딩 시작...");
                const gestureModel = await tf.loadLayersModel('indexeddb://gesture-model');
                setModel(gestureModel);
                console.log("제스처 모델 로딩 완료!");

                console.log("라벨 로딩 시작...");
                const savedLabels = localStorage.getItem('gestureLabels');
                if (savedLabels) {
                    const parsedLabels = JSON.parse(savedLabels);
                    setLabels(parsedLabels);
                    console.log("로드된 라벨:", parsedLabels);
                } else {
                    throw new Error("저장된 라벨을 찾을 수 없습니다.");
                }
            } catch (error: any) {
                console.error("모델 로딩 중 오류:", error);
                setError(error.message || "모델 로드에 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadModels();

        return () => {
            stopDetection();
            if (model) {
                model.dispose();
            }
        };
    }, []);

    useEffect(() => {
        checkModelStatus();
    }, [model, labels]);

    const predictGesture = async (landmarks: number[]) => {
        if (!model || !labels.length) return;

        let input: tf.Tensor2D | null = null;
        let prediction: tf.Tensor | null = null;

        try {
            input = tf.tensor2d([landmarks]);
            prediction = model.predict(input) as tf.Tensor;
            const probabilities = await prediction.data();
            const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
            setPrediction(labels[maxProbIndex]);
        } catch (error) {
            console.error("예측 중 오류:", error);
        } finally {
            if (input) input.dispose();
            if (prediction) prediction.dispose();
        }
    };

    const detectLoop = async () => {
        if (!detectingRef.current) return;

        try {
            const video = webcamRef.current?.video;
            if (!video || !handposeModelRef.current ||
                video.readyState !== 4 ||
                video.videoWidth === 0 ||
                video.videoHeight === 0) {
                requestAnimationFrame(detectLoop);
                return;
            }

            updateFPS();
            const hands = await handposeModelRef.current.estimateHands(video);

            if (hands.length > 0) {
                const landmarks = hands[0].landmarks.flat();
                await predictGesture(landmarks);
            }

            if (detectingRef.current) {
                setTimeout(() => {
                    requestAnimationFrame(detectLoop);
                }, 100);
            }
        } catch (error) {
            console.error("감지 중 오류:", error);
            if (detectingRef.current) {
                requestAnimationFrame(detectLoop);
            }
        }
    };

    const handleWebcamReady = () => {
        console.log("웹캠 준비 완료");
        const checkVideo = () => {
            const video = webcamRef.current?.video;
            if (video &&
                video.readyState === 4 &&
                video.videoWidth !== 0 &&
                video.videoHeight !== 0) {
                setIsWebcamReady(true);
            } else {
                setTimeout(checkVideo, 100);
            }
        };
        checkVideo();
    };

    useEffect(() => {
        if (isWebcamReady && model && handposeModelRef.current && !isDetecting) {
            console.log("모든 준비가 완료되어 감지를 시작합니다.");
            setIsDetecting(true);
            detectingRef.current = true;
            requestAnimationFrame(detectLoop);
        }
    }, [isWebcamReady, model]);

    const stopDetection = () => {
        console.log("감지 중지");
        setIsDetecting(false);
        detectingRef.current = false;
        setPrediction('');
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-black">제스처 인식</h2>

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-black">모델 로딩 중...</div>
            ) : (
                <div className="relative">
                    <Webcam
                        ref={webcamRef}
                        className="rounded-lg"  // hidden 제거
                        videoConstraints={videoConstraints}
                        style={{
                            width: '640px',
                            height: '480px',
                            opacity: 0,  // 투명도를 0으로 설정
                            position: 'absolute'  // 다른 요소와 겹치지 않도록
                        }}
                        mirrored={true}
                        onUserMedia={handleWebcamReady}
                    />
                    {prediction && (
                        <div className="bg-black bg-opacity-50 text-white p-2 rounded">
                            인식된 제스처: {prediction}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 text-white">
                <h3>상태 정보:</h3>
                <p>웹캠 준비됨: {isWebcamReady ? "예" : "아니오"}</p>
                <p>Handpose 모델: {handposeModelRef.current ? "로드됨" : "로드 중"}</p>
                <p>제스처 모델: {model ? "로드됨" : "로드 중"}</p>
                <p>등록된 제스처 수: {labels.length}</p>
                <p>현재 상태: {isLoading ? "로딩 중" : isDetecting ? "감지 중" : "대기 중"}</p>
                <p>FPS: {fps}</p>
            </div>
        </div>
    );
};

export default GestureRecognition;