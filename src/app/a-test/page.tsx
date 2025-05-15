"use client";

import Notification from "../components/notification/page";
import { MirrorProvider } from "../context/MirrorContext";
import SharedCamera from "../context/SharedCamera";
import Mirror from "./mirror";
import GestureRecognition from "./test";

export default function CollectPage() {

    return (
        <div className="p-4">
            <h1>퓨전 테스트</h1>
            <MirrorProvider>
                <Notification />
                <SharedCamera>
                    <Mirror />
                    <GestureRecognition />
                </SharedCamera>
            </MirrorProvider>
        </div>
    );
}