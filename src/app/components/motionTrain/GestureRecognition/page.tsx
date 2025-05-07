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
    const detectingRef = useRef(false);

    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user",
    };

    // 모델 로딩 상태를 확인하는 함수
    const checkModelStatus = () => {
        console.log("모델 상태 체크:", {
            gestureModel: model ? "로드됨" : "로드되지 않음",
            handposeModel: handposeModelRef.current ? "로드됨" : "로드되지 않음",
            labels: labels.length > 0 ? "로드됨" : "로드되지 않음"
        });
    };

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
        const loadModels = async () => {
            setIsLoading(true);
            try {
                // 1. Handpose 모델 로드
                console.log("Handpose 모델 로딩 시작...");
                handposeModelRef.current = await handpose.load();
                console.log("Handpose 모델 로딩 완료!");

                // 2. 제스처 인식 모델 로드
                console.log("제스처 모델 로딩 시작...");
                const gestureModel = await tf.loadLayersModel('indexeddb://gesture-model');
                setModel(gestureModel);
                console.log("제스처 모델 로딩 완료!");
                
                // 3. 라벨 로드
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
    }, []);
    // 모델 상태가 변경될 때마다 상태 체크
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
            // 텐서 메모리 해제
            if (input) input.dispose();
            if (prediction) prediction.dispose();
        }
    };

    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 정리
            stopDetection();
            if (model) {
                model.dispose();
            }
        };
    }, [model]);

    const detectLoop = async () => {
        if (!webcamRef.current?.video || !handposeModelRef.current || !detectingRef.current) {
            return;
        }

        try {
            updateFPS();
            const hands = await handposeModelRef.current.estimateHands(webcamRef.current.video);

            if (hands.length > 0) {
                const landmarks = hands[0].landmarks.flat();
                await predictGesture(landmarks);
            }

            // 프레임 제한 추가
            setTimeout(() => {
                if (detectingRef.current) {
                    requestAnimationFrame(detectLoop);
                }
            }, 100); // 100ms 딜레이 추가
        } catch (error) {
            console.error("감지 중 오류:", error);
        }
    };

    const startDetection = () => {
        console.log("감지 시작 시도");
        if (!handposeModelRef.current || !model) {
            console.log("모델이 준비되지 않음:", {
                handpose: !!handposeModelRef.current,
                gestureModel: !!model
            });
            return;
        }

        setIsDetecting(true);
        detectingRef.current = true;
        detectLoop();
        console.log("감지 시작됨");
    };

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
                        className="rounded-lg"
                        videoConstraints={videoConstraints}
                        style={{
                            width: '640px',
                            height: '480px'
                        }}
                        mirrored={true}
                    />
                    {prediction && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                            인식된 제스처: {prediction}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4">
                <button
                    onClick={isDetecting ? stopDetection : startDetection}
                    className={`px-4 py-2 ${isDetecting
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                        } text-white rounded`}
                    disabled={isLoading || !model || !handposeModelRef.current}
                >
                    {isLoading ? "로딩 중..." : isDetecting ? "인식 중지" : "인식 시작"}
                </button>
            </div>

            <div className="mt-4 text-white">
                <h3>상태 정보:</h3>
                <p>웹캠 준비됨: {webcamRef.current?.video ? "예" : "아니오"}</p>
                <p>Handpose 모델: {handposeModelRef.current ? "로드됨" : "로드 중"}</p>
                <p>제스처 모델: {model ? "로드됨" : "로드 중"}</p>
                <p>등록된 제스처 수: {labels.length}</p>
                <p>현재 상태: {isLoading ? "로딩 중" : isDetecting ? "감지 중" : "대기 중"}</p>
            </div>
        </div>
    );
};

export default GestureRecognition;