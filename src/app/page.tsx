"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  // ✅ 시계 상태 (초기값: 현재 시간)
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // ✅ 사용자 ID (얼굴 인식 API에서 받아올 값)
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 공지사항 목록 (초기값: 빈 배열)
  const [notifications, setNotifications] = useState<string[]>(["📢 공지사항을 불러오는 중..."]);

  // ✅ 현재 표시되는 공지 & 애니메이션 상태
  const [currentNotification, setCurrentNotification] = useState<string | null>(notifications[0]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // ✅ 오늘의 식단 (초기값: 기본 데이터)
  const [mealSchedule, setMealSchedule] = useState({
    breakfast: "정보 없음",
    lunch: "정보 없음",
    dinner: "정보 없음",
  });

  // ✅ 시계 업데이트 (1초마다)
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // ✅ [백엔드 연동] 사용자 얼굴 인식 API 호출 → userId 가져오기
  const fetchUserId = async () => {
    try {
      const response = await fetch("http://백엔드서버주소/api/user-id");
      const data = await response.json();

      if (response.ok) {
        setUserId(data.userId);
      } else {
        console.error("사용자 ID를 가져올 수 없음:", data.message);
      }
    } catch (error) {
      console.error("사용자 ID 가져오기 오류:", error);
    }
  };

  // ✅ [백엔드 연동] 사용자별 공지 필터링 API 호출
  const fetchNotifications = async (userId: string | null) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://백엔드서버주소/api/notifications?userId=${userId}`);
      const data = await response.json();

      if (response.ok && data.notifications.length > 0) {
        setNotifications(data.notifications);
        setCurrentNotification(data.notifications[0]);
      } else {
        setNotifications(["📢 공지사항이 없습니다."]);
        setCurrentNotification("📢 공지사항이 없습니다.");
      }
    } catch (error) {
      console.error("공지사항 가져오기 오류:", error);
      setNotifications(["❌ 공지사항을 불러올 수 없습니다."]);
      setCurrentNotification("❌ 공지사항을 불러올 수 없습니다.");
    }
  };

  // ✅ [백엔드 연동] 사용자별 공지 읽음 기록 API 호출
  const markNotificationAsRead = async (notification: string) => {
    if (!userId) return;

    try {
      await fetch("http://백엔드서버주소/api/mark-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, notification }),
      });
    } catch (error) {
      console.error("공지 읽음 처리 오류:", error);
    }
  };

  // ✅ 사용자 ID 가져오기 (페이지 로딩 시 실행)
  useEffect(() => {
    fetchUserId();
  }, []);

  // ✅ 사용자 ID가 있으면 공지사항 가져오기
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId]);

  // ✅ 공지사항 변경 로직 (10초마다 새로운 공지 표시)
  useEffect(() => {
    if (notifications.length > 0) {
      let index = 0;
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          index = (index + 1) % notifications.length;
          setCurrentNotification(notifications[index]);
          markNotificationAsRead(notifications[index]);
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

        {/* ✅ 하단: 식단표 */}
        <footer className={styles.footer}>
          <h3>오늘의 식단</h3>
          <ul>
            <li>🍚 아침: {mealSchedule.breakfast}</li>
            <li>🍛 점심: {mealSchedule.lunch}</li>
            <li>🍲 저녁: {mealSchedule.dinner}</li>
          </ul>
        </footer>
      </div>
    </>
  );
}
