"use client";

import { useEffect, useState } from 'react';

export default function MealPage() {
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

    return (
        <div>
            {/* 최신 학식 정보를 가져오는 시스템 만들었음. 완전한건 아님 */}
            <h1>오늘의 학식</h1>
            {imageUrl ? <img src={imageUrl} alt="오늘의 학식" /> : <p>Loading...</p>}
        </div>
    );
}