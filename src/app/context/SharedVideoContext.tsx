// VideoContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface VideoContextType {
    stream: MediaStream | null;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoContext = createContext<VideoContextType>({ 
    stream: null, 
    videoRef: React.createRef() 
});

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 940,
                        height: 650,
                        facingMode: 'user'
                    }
                });
                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    await videoRef.current.play();
                }
            } catch (err) {
                console.error('Camera initialization error:', err);
            }
        };

        initCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <VideoContext.Provider value={{ stream, videoRef }}>
            {children}
        </VideoContext.Provider>
    );
};

export const useVideo = () => useContext(VideoContext);