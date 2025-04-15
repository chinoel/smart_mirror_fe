"use client";
import GestureRecognition from '../components/motionTrain/GestureRecognition/page';

export default function CollectPage() {

    return (
        <div className="p-4">
            <h1>인식 테스트</h1>
            <GestureRecognition/>
        </div>
    );
}