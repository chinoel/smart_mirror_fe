"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import axios from "axios";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  const [notifications, setNotifications] = useState<string[]>(["📢 공지사항을 불러오는 중..."]);
  const [weather, setWeather] = useState<string>("🌤 불러오는 중...");

  const [currentNotification, setCurrentNotification] = useState<string | null>(notifications[0]);
  const [isVisible, setIsVisible] = useState<boolean>(false);


  // 시계 업데이트 (1초마다)
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    axios.get("/api/weather")
      .then((response) => {
        // 날씨 데이터가 성공적으로 받아졌고, fcstValue가 존재할 때
        if (response.data.success && response.data.weather?.temperature?.fcstValue) {
          setWeather(`🌤 현재 기온: ${response.data.weather.temperature.fcstValue}°C`);
        } else {
          setWeather("날씨 정보를 가져오는 데 실패했습니다.");
        }
      })
      .catch(() => {
        setWeather("날씨 정보를 가져오는 데 실패했습니다.");
      });
  }, []);

  return (
    <>
      <Head>
        <title>스마트미러 - 메인</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span>{weather}</span>
          </div>
          <div className={styles.headerCenter}>
          </div>
          <div className={styles.headerRight}>
            <span>{currentTime}</span>
          </div>
        </header>

        {/* ✅ 공지사항 (중단 최상단, 상단과 중단 경계 부분) */}
        <main className={styles.middle}>
          <div className={styles.notificationContainer}>
            <div className={`${styles.notification} ${isVisible ? styles.show : styles.hide}`}>
              <p>{currentNotification}</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
