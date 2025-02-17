"use client";

import { useState, useEffect } from "react";
import styles from "./EmotionEffect.module.css"; // 스타일 파일

export default function EmotionEffect() {
  // 감정 상태
  const [emotion, setEmotion] = useState<string>("기쁨");
  const [effectVisible, setEffectVisible] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(3); // 기본 지속 시간 3초

  // 애니메이션 지속 시간 조절
  useEffect(() => {
    if (effectVisible) {
      const timer = setTimeout(() => setEffectVisible(false), duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [effectVisible, duration]);

  return (
    <div className={styles.container}>
      <h2>감정 이펙트 테스트</h2>

      {/* 감정 선택 */}
      <label>감정 선택: </label>
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
        onChange={(e) => setDuration(parseInt(e.target.value))}
      />

      {/* 애니메이션 효과 표시 */}
      {effectVisible && <div className={`${styles.effect} ${styles[emotion]}`}>{emotion} 효과</div>}
    </div>
  );
}
