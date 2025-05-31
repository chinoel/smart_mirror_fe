// TensorFlowContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

interface TensorFlowContextType {
    isInitialized: boolean;
    tf: typeof tf;
}

const TensorFlowContext = createContext<TensorFlowContextType>({ 
    isInitialized: false, 
    tf: tf 
});

export const TensorFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initTF = async () => {
            try {
                // TensorFlow.js 초기화 설정
                await tf.ready();
                await tf.setBackend('webgl');
                
                // GPU 메모리 관리 설정
                tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
                tf.env().set('WEBGL_FORCE_F16_TEXTURES', false);
                tf.env().set('WEBGL_VERSION', 2);
                tf.env().set('WEBGL_FLUSH_THRESHOLD', 1);
                
                // 메모리 정리 간격 설정
                const cleanupInterval = setInterval(() => {
                    if (tf.memory().numTensors > 0) {
                        tf.tidy(() => {});
                    }
                }, 1000);

                setIsInitialized(true);
                console.log('TensorFlow.js initialized with backend:', tf.getBackend());

                return () => {
                    clearInterval(cleanupInterval);
                    tf.engine().endScope();
                    tf.disposeVariables();
                };
            } catch (err) {
                console.error('TensorFlow initialization error:', err);
            }
        };

        initTF();
    }, []);

    return (
        <TensorFlowContext.Provider value={{ isInitialized, tf }}>
            {children}
        </TensorFlowContext.Provider>
    );
};

export const useTensorFlow = () => useContext(TensorFlowContext);