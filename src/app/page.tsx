"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./Home.module.css";

export default function Home() {
  // ✅ 시계 상태 (초기값: null → Hydration 오류 방지)
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  // ✅ 공지사항 목록 (나중에 API 연동 가능)
  const notifications = [
    "[공지] 오늘은 학교 행사일입니다.",
    "[공지] 내일 급식 변경 안내",
    "[공지] 3월 1일 공휴일 휴무",
  ];

  // ✅ 현재 표시되는 공지 & 애니메이션 상태
  const [currentNotification, setCurrentNotification] = useState<string>(notifications[0]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // ✅ 1초마다 시계 업데이트 (클라이언트에서만 실행)
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString()); // 🚀 클라이언트에서만 초기 시간 설정

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ 공지 알림 변경 로직 (10초마다 새 공지 표시)
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setIsVisible(false); // 먼저 공지 사라짐
      setTimeout(() => {
        index = (index + 1) % notifications.length;
        setCurrentNotification(notifications[index]);
        setIsVisible(true); // 새로운 공지 등장
      }, 500); // 공지 사라진 후 변경
    }, 10000); // 10초마다 실행 (5초 표시 + 5초 대기)

    return () => clearInterval(interval);
  }, []);

  // ✅ 동적으로 문서 제목 변경
  useEffect(() => {
    document.title = "스마트미러 - 메인";
  }, []);

  return (
    <>
      {/* ✅ `next/head` 사용하여 탭 제목 설정 */}
      <Head>
        <title>스마트미러 - 메인</title>
      </Head>

      <div className={styles.container}>
        {/* ✅ 상단: 가운데 SMARTMIR, 오른쪽 실시간 시계 */}
        <header className={styles.header}>
          <div className={styles.headerCenter}>
            <span>SMARTMIR</span>
          </div>
          <div className={styles.headerRight}>
            {/* 🚀 `null` 초기값 설정 → Hydration 오류 방지 */}
            {currentTime ? <span>{currentTime}</span> : <span>로딩 중...</span>}
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

        {/* ✅ 하단: 식단표 */}
        <footer className={styles.footer}>
          <h3>오늘의 식단</h3>
          <ul>
            <li>아침: 떡국</li>
            <li>점심: 김치찌개</li>
            <li>저녁: 치킨</li>
          </ul>
        </footer>
      </div>
    </>
  );
}
