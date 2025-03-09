"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Mirror from "@/app/components/mirror/page";
import Weather from "@/app/components/weather/page";
import Clock from "@/app/components/clock/page";
import Notification from "@/app/components/notification/page";
import Meal from "@/app/components/meal/page";
import EmotionEffect from "@/app/test/EmotionEffect"; // ✅ 올바른 파일명 적용
import { MirrorProvider } from "./context/MirrorContext";

export default function Home() {
  const [emotion, setEmotion] = useState("neutral");
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    // ✅ 얼굴 인식 감지 로직 (백엔드에서 감정 데이터를 받아오는 부분)
    const fetchEmotion = async () => {
      try {
        const response = await fetch("http://백엔드서버주소/api/emotion"); // 백엔드에서 감정 분석 데이터 받기
        const data = await response.json();
        if (data.faceDetected) {
          setFaceDetected(true);
          setEmotion(data.emotion); // 감정 데이터 설정
          console.log("🎭 감정 감지됨:", data.emotion);
        } else {
          setFaceDetected(false);
        }
      } catch (error) {
        console.error("⚠️ 감정 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    const interval = setInterval(fetchEmotion, 5000); // ✅ 5초마다 감정 분석 요청
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>스마트미러 - 메인</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Weather />
          </div>
          <div className={styles.headerRight}>
            <Clock />
          </div>
        </header>

        <MirrorProvider>
          <Notification />
          <Meal />
          <Mirror />
          {faceDetected && <EmotionEffect emotion={emotion} />} {/* ✅ 얼굴이 감지되었을 때 감정 표현 효과 표시 */}
        </MirrorProvider>
      </div>
    </>
  );
}
