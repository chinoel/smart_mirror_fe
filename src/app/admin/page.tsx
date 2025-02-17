"use client";

import { useState, useEffect } from "react";
import Head from "next/head"; // ✅ `next/head` 사용
import styles from "./Admin.module.css"; // ✅ 추가

export default function Admin() {
  const [notification, setNotification] = useState<string>("[학교 알림] 최신 공지사항");
  const [mealSchedule, setMealSchedule] = useState({
    breakfast: "떡국",
    lunch: "김치찌개",
    dinner: "치킨",
  });

  const [showPopup, setShowPopup] = useState<boolean>(false); // ✅ 저장 팝업 상태

  // ✅ 동적으로 문서 제목 변경
  useEffect(() => {
    document.title = "스마트미러 - 관리자";
  }, []);

  // ✅ 저장 함수 (저장 버튼 클릭 또는 Enter 키 입력 시 실행)
  const handleSave = () => {
    console.log("저장된 알림:", notification);
    console.log("저장된 식단표:", mealSchedule);

    // ✅ 저장 팝업 표시
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // 2초 후 자동 사라짐
  };

  // ✅ `Enter` 키 입력 시 자동 저장 기능 추가
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      {/* ✅ `next/head` 사용하여 탭 제목 설정 */}
      <Head>
        <title>스마트미러 - 관리자</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>관리자 페이지</h1>

        {/* 공지사항 수정 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>공지사항 수정</h2>
          <textarea
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            onKeyDown={handleKeyDown} // ✅ Enter 키 입력 시 자동 저장
            className={styles.textarea}
          />
        </section>

        {/* 식단표 수정 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>식단표 수정</h2>
          <div className={styles.inputGroup}>
            <label>아침: </label>
            <input
              type="text"
              value={mealSchedule.breakfast}
              onChange={(e) => setMealSchedule({ ...mealSchedule, breakfast: e.target.value })}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>점심: </label>
            <input
              type="text"
              value={mealSchedule.lunch}
              onChange={(e) => setMealSchedule({ ...mealSchedule, lunch: e.target.value })}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>저녁: </label>
            <input
              type="text"
              value={mealSchedule.dinner}
              onChange={(e) => setMealSchedule({ ...mealSchedule, dinner: e.target.value })}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
          </div>
        </section>

        {/* 저장 버튼 */}
        <button onClick={handleSave} className={styles.button}>저장</button>

        {/* ✅ 저장 팝업 */}
        {showPopup && <div className={styles.popup}>✅ 저장되었습니다!</div>}
      </div>
    </>
  );
}
