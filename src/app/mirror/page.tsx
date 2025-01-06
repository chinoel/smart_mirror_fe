"use client";
import { useEffect, useRef } from "react";

export default function Admin() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    
    useEffect(() => {
        const initCamera = async() => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video:true});
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error(error);
            }
        }
        initCamera();
    });

    return (
        <>
            <video ref={videoRef} autoPlay playsInline />
        </>
    );
}
