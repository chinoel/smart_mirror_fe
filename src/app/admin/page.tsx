"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "./Admin.module.css";

export default function Admin() {
  const router = useRouter();

  // ✅ 공지사항 & 식단표 상태 관리
  const [notification, setNotification] = useState("");
  const [mealSchedule, setMealSchedule] = useState({ breakfast: "", lunch: "", dinner: "" });

  // ✅ 이전 기록 상태 관리
  const [showPopup, setShowPopup] = useState(false);
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const [showMealHistory, setShowMealHistory] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);

  // ✅ 공지사항 & 식단표 데이터 불러오기 (최적화)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notificationRes, mealRes] = await Promise.all([
          fetch("http://백엔드서버주소/api/admin/notifications"),
          fetch("http://백엔드서버주소/api/admin/meal-schedule"),
        ]);

        const [notificationData, mealData] = await Promise.all([notificationRes.json(), mealRes.json()]);

        if (notificationRes.ok) setNotification(notificationData.notification);
        if (mealRes.ok) setMealSchedule(mealData);
      } catch (error) {
        console.error("데이터 불러오기 오류:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ 이전 기록 불러오기 (백엔드 연동)
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://백엔드서버주소/api/admin/history");
      const data = await response.json();

      if (response.ok) {
        setNotificationHistory(data.notificationHistory);
        setMealHistory(data.mealHistory);
      }
    } catch (error) {
      console.error("이전 기록 불러오기 오류:", error);
    }
  };

  // ✅ 저장 기능 (공지사항 & 식단표 업데이트)
  const handleSave = async () => {
    try {
      const response = await fetch("http://백엔드서버주소/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification, mealSchedule }),
      });

      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error("저장 오류:", error);
    }
  };

  // ✅ 로그아웃 기능
  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>스마트미러 - 관리자</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>📌 관리자 페이지</h1>

        {/* ✅ 로그아웃 버튼 */}
        <button onClick={handleLogout} className={styles.logoutButton}>🚪 로그아웃</button>

        {/* ✅ 공지사항 수정 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>공지사항 수정</h2>
          <textarea
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            className={styles.textarea}
          />
        </section>

        {/* ✅ 식단표 수정 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>식단표 수정</h2>
          <div className={styles.mealContainer}>
            {["breakfast", "lunch", "dinner"].map((meal, index) => (
              <div key={index} className={styles.mealItem}>
                <label>{meal === "breakfast" ? "🍚 아침" : meal === "lunch" ? "🍛 점심" : "🍲 저녁"}</label>
                <input
                  type="text"
                  value={mealSchedule[meal]}
                  onChange={(e) => setMealSchedule({ ...mealSchedule, [meal]: e.target.value })}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ✅ 이전 기록 보기 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => {
              setShowNotificationHistory(!showNotificationHistory);
              if (!showNotificationHistory) fetchHistory();
            }}
            className={styles.notificationHistoryButton}
          >
            {showNotificationHistory ? "🔽 공지사항 기록 닫기" : "📜 공지사항 기록 보기"}
          </button>

          <button
            onClick={() => {
              setShowMealHistory(!showMealHistory);
              if (!showMealHistory) fetchHistory();
            }}
            className={styles.mealHistoryButton}
          >
            {showMealHistory ? "🔽 식단표 기록 닫기" : "🍽️ 식단표 기록 보기"}
          </button>
        </div>

        {/* ✅ 공지사항 기록 */}
        {showNotificationHistory && (
          <div className={styles.historyBox}>
            <h3>📜 공지사항 기록</h3>
            <ul>
              {notificationHistory.length > 0 ? notificationHistory.map((item, index) => (
                <li key={index}>{item}</li>
              )) : <li>📌 기록이 없습니다.</li>}
            </ul>
          </div>
        )}

        {/* ✅ 식단표 기록 */}
        {showMealHistory && (
          <div className={styles.historyBox}>
            <h3>🍽️ 식단표 기록</h3>
            <ul>
              {mealHistory.length > 0 ? mealHistory.map((item, index) => (
                <li key={index}>{item}</li>
              )) : <li>📌 기록이 없습니다.</li>}
            </ul>
          </div>
        )}

        {/* ✅ 저장 버튼 */}
        <button onClick={handleSave} className={styles.button}>💾 저장</button>

        {/* ✅ 저장 팝업 */}
        {showPopup && <div className={styles.popup}>✅ 저장되었습니다!</div>}
      </div>
    </>
  );
}
