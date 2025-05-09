"use client";
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

interface TrainingMetrics {
    loss: number;
    acc: number;
    val_loss: number;
    val_acc: number;
}

const GestureTraining = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [trainedLabels, setTrainedLabels] = useState<string[]>([]);
    const [epochs, setEpochs] = useState(100);
    const [batchSize, setBatchSize] = useState(16);
    const [validationSplit, setValidationSplit] = useState(0.2);
    const [trainingCount, setTrainingCount] = useState(1);
    const [currentTraining, setCurrentTraining] = useState(0);
    const [bestAccuracy, setBestAccuracy] = useState(0);
    const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);

    useEffect(() => {
        return () => {
            tf.disposeVariables();
        };
    }, []);

    const [modelFile, setModelFile] = useState<File | null>(null);
    const [weightsFile, setWeightsFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // .json 파일과 .bin 파일 구분
        Array.from(files).forEach(file => {
            if (file.name.endsWith('.json')) {
                setModelFile(file);
            } else if (file.name.endsWith('.bin')) {
                setWeightsFile(file);
            }
        });
    };

    const uploadModel = async () => {
        if (!modelFile || !weightsFile) {
            alert('모델 구조(.json)와 가중치(.bin) 파일을 모두 선택해주세요.');
            return;
        }

        try {
            const model = await tf.loadLayersModel(
                tf.io.browserFiles([modelFile, weightsFile])
            );

            // IndexedDB에 저장
            await model.save('indexeddb://gesture-model');

            console.log('모델 업로드 완료');
            alert('모델 업로드가 완료되었습니다.');
        } catch (error) {
            console.error('모델 업로드 중 오류:', error);
            alert('모델 업로드 중 오류가 발생했습니다.');
        }
    };

    const trainModel = async () => {
        setIsTraining(true);
        setError('');
        setMetrics([]);
        let currentBestAccuracy = 0;
        let bestModel: tf.LayersModel | null = null as tf.LayersModel | null;

        try {
            const gestureData = JSON.parse(localStorage.getItem('gestureData') || '[]');

            if (gestureData.length === 0) {
                throw new Error('학습할 데이터가 없습니다.');
            }

            const uniqueLabels = Array.from(new Set(gestureData.map((d: any) => d.label)));
            setTrainedLabels(uniqueLabels as string[]);

            for (let training = 0; training < trainingCount; training++) {
                setCurrentTraining(training + 1);

                // 데이터 정규화
                const landmarks = gestureData.map((d: any) => d.landmarks);
                const normalizedData = tf.tidy(() => {
                    const inputTensor = tf.tensor2d(landmarks);
                    const mean = inputTensor.mean(0);
                    const { variance } = tf.moments(inputTensor, 0);
                    const std = tf.sqrt(variance);
                    return inputTensor.sub(mean).div(std);
                });

                const xs = normalizedData;
                const ys = tf.oneHot(
                    gestureData.map((d: any) => uniqueLabels.indexOf(d.label)),
                    uniqueLabels.length
                );

                const model = tf.sequential();

                // 입력층
                model.add(tf.layers.dense({
                    inputShape: [63],
                    units: 128,
                    activation: 'relu',
                    kernelInitializer: 'glorotNormal'
                }));

                // 배치 정규화 및 드롭아웃
                model.add(tf.layers.batchNormalization());
                model.add(tf.layers.dropout({ rate: 0.3 }));

                // 은닉층
                model.add(tf.layers.dense({
                    units: 64,
                    activation: 'relu',
                    kernelInitializer: 'glorotNormal'
                }));

                model.add(tf.layers.batchNormalization());
                model.add(tf.layers.dropout({ rate: 0.2 }));

                // 출력층
                model.add(tf.layers.dense({
                    units: uniqueLabels.length,
                    activation: 'softmax'
                }));

                // 모델 컴파일
                model.compile({
                    optimizer: tf.train.adam(0.001),
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy'],
                });

                // 모델 학습
                const history = await model.fit(xs, ys, {
                    epochs: epochs,
                    batchSize: batchSize,
                    validationSplit: validationSplit,
                    shuffle: true,
                    callbacks: {
                        onEpochEnd: (epoch, logs: any) => {
                            const currentProgress =
                                ((training * epochs) + epoch + 1) / (epochs * trainingCount) * 100;
                            setProgress(Math.round(currentProgress));

                            const currentMetrics = {
                                loss: logs.loss,
                                acc: logs.acc,
                                val_loss: logs.val_loss,
                                val_acc: logs.val_acc
                            };

                            setMetrics(prev => [...prev, currentMetrics]);

                            if (logs.val_acc > currentBestAccuracy) {
                                currentBestAccuracy = logs.val_acc;
                                setBestAccuracy(currentBestAccuracy);
                                bestModel = model;
                            }
                        }
                    }
                });

                // 메모리 정리
                xs.dispose();
                ys.dispose();
            }

            if (bestModel) {
                await bestModel.save('indexeddb://gesture-model');
                localStorage.setItem('gestureLabels', JSON.stringify(uniqueLabels));
                alert(`모델 학습이 완료되었습니다.\n최고 정확도: ${(currentBestAccuracy * 100).toFixed(2)}%`);
            }

        } catch (err: any) {
            setError(err.message || '학습 중 오류가 발생했습니다.');
        } finally {
            setIsTraining(false);
        }
    };

    const downloadModel = async () => {
        try {
            const model = await tf.loadLayersModel('indexeddb://gesture-model');
            await model.save('downloads://gesture-model');
        } catch (error) {
            console.error('모델 다운로드 중 오류:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-black">제스처 모델 학습</h2>

            <div className="mb-6 p-4 bg-white rounded shadow text-black">
                <h3 className="font-bold mb-4">학습 매개변수 설정</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-2">학습 반복 횟수</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={trainingCount}
                            onChange={(e) => setTrainingCount(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-black"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            전체 학습을 반복할 횟수
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2">에포크 (Epochs)</label>
                        <input
                            type="number"
                            min="1"
                            max="1000"
                            value={epochs}
                            onChange={(e) => setEpochs(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-black"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            전체 데이터셋을 학습하는 횟수
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2">배치 크기</label>
                        <input
                            type="number"
                            min="1"
                            max="128"
                            value={batchSize}
                            onChange={(e) => setBatchSize(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-black"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            한 번에 처리할 데이터 수
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2">검증 데이터 비율</label>
                        <input
                            type="number"
                            min="0"
                            max="0.5"
                            step="0.1"
                            value={validationSplit}
                            onChange={(e) => setValidationSplit(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded text-black"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            검증에 사용할 데이터 비율 (0~0.5)
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                {isTraining ? (
                    <div className="space-y-4">
                        <div className="text-white">
                            학습 회차: {currentTraining}/{trainingCount}
                        </div>
                        <div className="text-white">
                            진행률: {progress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded">
                            <div
                                className="bg-blue-600 rounded h-2"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {metrics.length > 0 && (
                            <div className="mt-4 p-4 bg-white rounded shadow text-black">
                                <h4 className="font-bold mb-2">최근 학습 메트릭스</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p>학습 손실: {metrics[metrics.length - 1].loss.toFixed(4)}</p>
                                        <p>학습 정확도: {(metrics[metrics.length - 1].acc * 100).toFixed(2)}%</p>
                                    </div>
                                    <div>
                                        <p>검증 손실: {metrics[metrics.length - 1].val_loss.toFixed(4)}</p>
                                        <p>검증 정확도: {(metrics[metrics.length - 1].val_acc * 100).toFixed(2)}%</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="font-bold">최고 정확도: {(bestAccuracy * 100).toFixed(2)}%</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={trainModel}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={isTraining}
                    >
                        모델 학습 시작
                    </button>
                )}
            </div>

            {error && (
                <div className="text-red-500 mb-4">
                    {error}
                </div>
            )}

            {trainedLabels.length > 0 && (
                <div className="mt-4 text-white">
                    <h3 className="font-bold mb-2">학습된 제스처:</h3>
                    <ul className="list-disc list-inside">
                        {trainedLabels.map((label, index) => (
                            <li key={index}>{label}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4">
                <button
                    onClick={downloadModel}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                >
                    모델 구조 다운로드
                </button>
            </div>
            <div className="mt-4">
                <input
                    type="file"
                    multiple
                    accept=".json,.bin"
                    onChange={handleFileChange}
                    className="px-4 py-2 bg-gray-200 rounded text-black"
                />
                <button
                    onClick={uploadModel}
                    disabled={!modelFile || !weightsFile}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2 disabled:bg-gray-400"
                >
                    모델 업로드
                </button>
            </div>
        </div>
    );
};

export default GestureTraining;