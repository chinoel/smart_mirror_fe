"use client";

import { useState, useEffect } from "react";
import Head from "next/head"; // ✅ `next/head` 사용
import styles from "./Home.module.css";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // 공지사항 목록 (나중에 API 연동 가능)
  const [notifications] = useState<string[]>([
    "[공지] 오늘은 학교 행사일입니다.",
    "[공지] 내일 급식 변경 안내",
    "[공지] 3월 1일 공휴일 휴무"
  ]);

  // 현재 표시되는 공지
  const [currentNotification, setCurrentNotification] = useState<string | null>(
    notifications.length > 0 ? notifications[0] : null
  );

  // 애니메이션 상태 (true: 표시됨, false: 사라짐)
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // ✅ 1초마다 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 공지 알림 변경 로직 (10초마다 새 공지 표시)
  useEffect(() => {
    if (notifications.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          index = (index + 1) % notifications.length;
          setCurrentNotification(notifications[index]);
          setIsVisible(true);
        }, 500);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [notifications]);

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
        {/* 상단: 가운데 SMARTMIR, 오른쪽 실시간 시계 */}
        <header className={styles.header}>
          <div className={styles.headerCenter}>
            <span>SMARTMIR</span>
          </div>
          <div className={styles.headerRight}>
            <span>{currentTime}</span>
          </div>
        </header>

        {/* 중단: 학교 공지 (중단 영역의 최상단에 배치) */}
        <main className={styles.middle}>
          <div className={styles.notificationWrapper}>
            {currentNotification && (
              <div
                className={`${styles.notification} ${
                  isVisible ? styles.show : styles.hide
                }`}
              >
                <p>{currentNotification}</p>
              </div>
            )}
          </div>
        </main>

        {/* 하단: 식단표 */}
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
