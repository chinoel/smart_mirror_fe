"use client";

import { useEffect, useState } from "react";

interface FirstPageProps {
    isPreloading?: boolean;
}

export default function FirstPage({ isPreloading = false }: FirstPageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/meal')
            .then(response => response.json())
            .then(data => {
                setImageUrl(data.imageUrl);
            })
            .catch(error => {
                console.error('Failed to fetch meal data:', error);
            });
    }, []);

    // 프리로딩 중일 때는 아무것도 렌더링하지 않음
    if (isPreloading) {
        return null;
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center">
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt="오늘의 학식" 
                    className="max-w-[90%] max-h-[90%] object-contain"
                />
            ) : (
                <p className="text-white">Loading...</p>
            )}
        </div>
    );
}