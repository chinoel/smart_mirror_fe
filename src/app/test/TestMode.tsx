"use client";

import { useState } from "react";
import styles from "./test.module.css";

export default function TestMode() {
  const [emotion, setEmotion] = useState<string>("neutral");

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: "3rem" }}>🎭 감정 테스트 모드</h1>
      <div className={`${styles.emotionBox} ${styles[emotion]}`}>
        {emotion === "happy" && "😄 기쁨"}
        {emotion === "sad" && "😢 슬픔"}
        {emotion === "angry" && "😡 화남"}
        {emotion === "annoyed" && "😤 짜증"}
        {emotion === "neutral" && "😐 아무 감정 없음"}
      </div>

      <div className={styles.selectContainer}>
        <label htmlFor="emotionSelect">감정 선택: </label>
        <select
          id="emotionSelect"
          className={styles.customSelect}  // ✅ 여기서 CSS 클래스 적용
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        >
          <option value="neutral">😐 아무 감정 없음</option>
          <option value="happy">😄 기쁨</option>
          <option value="sad">😢 슬픔</option>
          <option value="angry">😡 화남</option>
          <option value="annoyed">😤 짜증</option>
        </select>
      </div>
    </div>
  );
}
