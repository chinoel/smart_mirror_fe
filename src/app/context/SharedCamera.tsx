// SharedCamera.tsx
import React, { useEffect, useState } from 'react';

interface SharedCameraProps {
    children: React.ReactNode;
}

interface MediaStreamProps {
    videoStream: MediaStream;
}

const SharedCamera: React.FC<SharedCameraProps> = ({ children }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
            } catch (err) {
                console.error(err);
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
        <div>
            {stream && React.Children.map(children, child =>
                React.cloneElement(child as React.ReactElement<MediaStreamProps>, { videoStream: stream })
            )}
        </div>
    );
};

export default SharedCamera;