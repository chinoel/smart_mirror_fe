"use client";
import { useState } from 'react';
import DataCollection from '@/app/components/motionTrain/DataCollection/page';

export default function CollectPage() {
    const [gestureName, setGestureName] = useState('');

    return (
        <div className="p-4">
            <h1>제스처 데이터 수집</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={gestureName}
                    onChange={(e) => setGestureName(e.target.value)}
                    placeholder="제스처 이름 (예: thumbsUp)"
                    className="border p-2"
                    style={{ color: 'black' }}
                />
            </div>
            <DataCollection gestureName={gestureName} />
        </div>
    );
}