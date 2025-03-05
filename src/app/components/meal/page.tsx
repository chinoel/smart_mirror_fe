"use client";

import { useMirror } from '@/app/context/MirrorContext';
import { useEffect, useState } from 'react';

export default function Meal() {
    const { mirrorMode, setMirrorMode } = useMirror();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    if (mirrorMode !== 2) return null;

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

    return (
        <>
            {imageUrl ? <img src={imageUrl} alt="오늘의 학식" /> : <p>Loading...</p>}
        </>
    );
}