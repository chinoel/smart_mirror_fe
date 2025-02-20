"use client";

import { useState, useEffect } from "react";
import styles from "./EmotionEffect.module.css";

export default function EmotionEffect() {
  const [emotion, setEmotion] = useState<string>("기쁨");
  const [duration, setDuration] = useState<number>(3);
  const [effectVisible, setEffectVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setEffectVisible(false), duration * 1000);
    return () => clearTimeout(timer);
  }, [emotion, duration]); // `emotion` 상태 변경 시 다시 실행됨

  return (
    <div className={styles.container}>
      <h2>감정 이펙트 테스트</h2>

      {/* 감정 선택 */}
      <label>감정 선택:</label>
      <select
        value={emotion}
        onChange={(e) => {
          setEmotion(e.target.value);
          setEffectVisible(true);
        }}
      >
        <option value="기쁨">😊 기쁨</option>
        <option value="슬픔">😢 슬픔</option>
        <option value="화남">😡 화남</option>
        <option value="짜증">😤 짜증</option>
        <option value="아무 생각 없음">😐 아무 생각 없음</option>
      </select>

      {/* 애니메이션 지속 시간 조절 */}
      <label>애니메이션 지속 시간: {duration}초</label>
      <input
        type="range"
        min="1"
        max="10"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      {/* 애니메이션 효과 표시 */}
      {effectVisible && <div className={`${styles.effect} ${styles[emotion]}`}>{emotion} 효과</div>}
    </div>
  );
}
