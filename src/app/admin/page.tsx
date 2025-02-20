"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "./Admin.module.css";

export default function Admin() {
  const router = useRouter();

  const [notification, setNotification] = useState<string>(
    localStorage.getItem("latestNotification") || "[학교 알림] 최신 공지사항"
  );

  const [mealSchedule, setMealSchedule] = useState({
    breakfast: localStorage.getItem("latestBreakfast") || "떡국",
    lunch: localStorage.getItem("latestLunch") || "김치찌개",
    dinner: localStorage.getItem("latestDinner") || "치킨",
  });

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(
    JSON.parse(localStorage.getItem("notificationHistory") || "[]")
  );

  const handleSave = () => {
    localStorage.setItem("latestNotification", notification);
    localStorage.setItem("latestBreakfast", mealSchedule.breakfast);
    localStorage.setItem("latestLunch", mealSchedule.lunch);
    localStorage.setItem("latestDinner", mealSchedule.dinner);

    const updatedHistory = [
      `📢 ${notification} (🍚 ${mealSchedule.breakfast} / 🍛 ${mealSchedule.lunch} / 🍲 ${mealSchedule.dinner})`,
      ...history,
    ];
    localStorage.setItem("notificationHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>스마트미러 - 관리자</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>관리자 페이지</h1>

        {/* ✅ 로그아웃 버튼 */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          🚪 로그아웃
        </button>

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
            <div className={styles.mealItem}>
              <label>🍚 아침</label>
              <input
                type="text"
                value={mealSchedule.breakfast}
                onChange={(e) =>
                  setMealSchedule({ ...mealSchedule, breakfast: e.target.value })
                }
                className={styles.input}
              />
            </div>
            <div className={styles.mealItem}>
              <label>🍛 점심</label>
              <input
                type="text"
                value={mealSchedule.lunch}
                onChange={(e) =>
                  setMealSchedule({ ...mealSchedule, lunch: e.target.value })
                }
                className={styles.input}
              />
            </div>
            <div className={styles.mealItem}>
              <label>🍲 저녁</label>
              <input
                type="text"
                value={mealSchedule.dinner}
                onChange={(e) =>
                  setMealSchedule({ ...mealSchedule, dinner: e.target.value })
                }
                className={styles.input}
              />
            </div>
          </div>
        </section>

        {/* ✅ 버튼 컨테이너 - 미리보기 & 이전 기록 보기 */}
        <div className={styles.buttonContainer}>
          <button onClick={() => setShowPreview(!showPreview)} className={styles.previewButton}>
            {showPreview ? "🔽 미리보기 닫기" : "🔼 미리보기"}
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className={styles.historyButton}>
            {showHistory ? "🔽 이전 기록 닫기" : "📜 이전 기록 보기"}
          </button>
        </div>

        {/* ✅ 미리보기 내용 */}
        {showPreview && (
          <div className={styles.previewBox}>
            <h3>📢 공지사항</h3>
            <p>{notification}</p>
            <h3>🍽️ 오늘의 식단</h3>
            <ul>
              <li><strong>아침:</strong> {mealSchedule.breakfast}</li>
              <li><strong>점심:</strong> {mealSchedule.lunch}</li>
              <li><strong>저녁:</strong> {mealSchedule.dinner}</li>
            </ul>
          </div>
        )}

        {/* ✅ 히스토리 내용 */}
        {showHistory && (
          <div className={styles.historyBox}>
            <h3>📜 이전 기록</h3>
            <ul>
              {history.length > 0 ? (
                history.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>📌 기록이 없습니다.</li>
              )}
            </ul>
          </div>
        )}

        {/* ✅ 저장 버튼 */}
        <button onClick={handleSave} className={styles.button}>
          💾 저장
        </button>

        {/* ✅ 저장 팝업 */}
        {showPopup && <div className={styles.popup}>✅ 저장되었습니다!</div>}
      </div>
    </>
  );
}
