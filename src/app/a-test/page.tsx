"use client";

import Notification from "../components/notification/page";
import { MirrorProvider } from "../context/MirrorContext";
import { VideoProvider } from "../context/SharedVideoContext";
import { TensorFlowProvider } from "../context/TensorFlowContext";
import GestureRecognition from "./gesturereconitionprops";
import Mirror from "./mirror";

export default function CollectPage() {

    return (
        <div className="p-4">
            <h1>퓨전 테스트</h1>
            <TensorFlowProvider>
                <VideoProvider>
                    <MirrorProvider>
                        <Notification />
                        <Mirror />
                        <GestureRecognition />
                    </MirrorProvider>
                </VideoProvider>
            </TensorFlowProvider>
        </div>
    );
}