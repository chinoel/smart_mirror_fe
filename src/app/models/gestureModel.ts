import * as tf from '@tensorflow/tfjs';

export const createModel = () => {
    const model = tf.sequential();

    // 입력층
    model.add(tf.layers.dense({
        inputShape: [63], // 21개 랜드마크 * 3(x,y,z)
        units: 128,
        activation: 'relu'
    }));

    // 은닉층
    model.add(tf.layers.dense({
        units: 64,
        activation: 'relu'
    }));

    // 출력층
    model.add(tf.layers.dense({
        units: 5, // 인식할 제스처 수
        activation: 'softmax'
    }));

    // 모델 컴파일
    model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};