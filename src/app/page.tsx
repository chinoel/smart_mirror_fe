"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Mirror from "@/app/components/mirror/page";
import Weather from "@/app/components/weather/page";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");

  // 공지사항 내용
  const [notifications, setNotifications] = useState<string[]>(["📢 공지사항을 불러오는 중..."]);

  // 공지 보여주고 숨기는 역할
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // 시계
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <>
      <Head>
        <title>스마트미러 - 메인</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Weather/>
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
              <p>{notifications}</p>
            </div>
          </div>
        </main>
        <Mirror />
      </div>
    </>
  );
}
