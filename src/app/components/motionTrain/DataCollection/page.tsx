"use client";
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';

interface DataCollectionProps {
    gestureName: string;
}


const DataCollection: React.FC<DataCollectionProps> = ({ gestureName }) => {
    const webcamRef = useRef<Webcam>(null);
    const [handposeModel, setHandposeModel] = useState<any>(null);
    const [dataset, setDataset] = useState<any[]>([]);
    const [isCollecting, setIsCollecting] = useState(false);
    const [error, setError] = useState<string>('');
    const [totalCount, setTotalCount] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawHand = (predictions: any, ctx: CanvasRenderingContext2D) => {
        // 감지된 손이 있다면
        if (predictions.length > 0) {
            predictions.forEach((prediction: any) => {
                // 랜드마크 포인트 그리기
                const landmarks = prediction.landmarks;
                for (let i = 0; i < landmarks.length; i++) {
                    const x = landmarks[i][0];
                    const y = landmarks[i][1];

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.fill();
                }

                // 손가락 연결선 그리기
                const fingers = [
                    [0, 1, 2, 3, 4],
                    [0, 5, 6, 7, 8],
                    [0, 9, 10, 11, 12],
                    [0, 13, 14, 15, 16],
                    [0, 17, 18, 19, 20]
                ];

                for (let f = 0; f < fingers.length; f++) {
                    const finger = fingers[f];
                    for (let i = 0; i < finger.length - 1; i++) {
                        const firstPoint = landmarks[finger[i]];
                        const secondPoint = landmarks[finger[i + 1]];

                        ctx.beginPath();
                        ctx.moveTo(firstPoint[0], firstPoint[1]);
                        ctx.lineTo(secondPoint[0], secondPoint[1]);
                        ctx.strokeStyle = "blue";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            });
        }
    };

    const detect = async () => {
        if (!handposeModel || !webcamRef.current || !canvasRef.current) return;

        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video && ctx) {
            // Canvas 크기를 비디오 크기에 맞춤
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // 비디오 프레임을 Canvas에 그림
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 손 감지
            const hand = await handposeModel.estimateHands(video);

            // 감지된 손 그리기
            drawHand(hand, ctx);
        }

        // 다음 프레임 요청
        requestAnimationFrame(detect);
    };

    useEffect(() => {
        if (handposeModel) {
            detect();
        }
    }, [handposeModel]);

    const exportData = () => {
        const data = localStorage.getItem('gestureData');
        if (!data) {
            alert('저장된 데이터가 없습니다.');
            return;
        }

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gesture-data.json';
        a.click();
    };

    const clearData = () => {
        if (window.confirm('모든 제스처 데이터를 삭제하시겠습니까?')) {
            localStorage.removeItem('gestureData');
            setDataset([]); // 현재 세션 데이터도 초기화
            setTotalCount(0); // 총 카운트도 초기화
            alert('데이터가 삭제되었습니다.');
        }
    };

    useEffect(() => {
        const updateTotalCount = () => {
            if (typeof window !== 'undefined') {
                const data = JSON.parse(localStorage.getItem('gestureData') || '[]');
                const count = data.filter((item: any) => item.label === gestureName).length;
                setTotalCount(count);
            }
        };

        updateTotalCount();
    }, [gestureName, dataset]);

    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready();
                await tf.setBackend('webgl');

                const model = await handpose.load();
                setHandposeModel(model);
                setError('');
            } catch (err) {
                setError('모델 로딩 실패');
                console.error(err);
            }
        };
        loadModel();
    }, []);

    const startCollecting = async () => {
        if (!gestureName) {
            setError('제스처 이름을 입력해주세요');
            return;
        }

        setIsCollecting(true);
        setError('');

        // 자동 데이터 수집 (10초간 100개 샘플)
        const interval = setInterval(async () => {
            await collectData();
        }, 100);

        // 10초 후 수집 중지
        setTimeout(() => {
            clearInterval(interval);
            setIsCollecting(false);
        }, 10000);
    };

    const collectData = async () => {
        if (!handposeModel || !webcamRef.current) return;

        try {
            const hand = await handposeModel.estimateHands(
                webcamRef.current.video as HTMLVideoElement
            );

            if (hand.length > 0) {
                const landmarks = hand[0].landmarks.flat();
                setDataset(prev => [...prev, {
                    landmarks,
                    label: gestureName,
                    timestamp: Date.now()
                }]);

                // 로컬 스토리지에 데이터 저장
                const existingData = JSON.parse(localStorage.getItem('gestureData') || '[]');
                existingData.push({
                    landmarks,
                    label: gestureName,
                    timestamp: Date.now()
                });
                localStorage.setItem('gestureData', JSON.stringify(existingData));
            }
        } catch (err) {
            setError('데이터 수집 중 오류 발생');
            setIsCollecting(false);
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 relative">
                <Webcam
                    ref={webcamRef}
                    style={{
                        width: 640,
                        height: 480,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        width: 640,
                        height: 480,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-bold">
                    Now Gesture : {gestureName || 'None'}
                </h2>
            </div>

            <div className="mb-4">
                <button
                    onClick={startCollecting}
                    disabled={isCollecting || !gestureName || !handposeModel}
                    className={`px-4 py-2 rounded ${isCollecting
                        ? 'bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {isCollecting ? '수집 중...' : '데이터 수집 시작'}
                </button>
            </div>

            <div className="space-y-2 mb-4">
                <div>현재 세션 수집된 데이터: {dataset.length}개</div>
                <div>총 저장된 데이터: {totalCount}개</div>
                {error && (
                    <div className="text-red-500">
                        에러: {error}
                    </div>
                )}
            </div>
            <button
                onClick={exportData}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white ml-2"
            >
                데이터 내보내기
            </button>

            <button
                onClick={clearData}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white ml-2"
            >
                데이터 삭제
            </button>
        </div>
    );
};

export default DataCollection;