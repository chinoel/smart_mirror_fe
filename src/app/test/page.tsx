"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import TestMode from "./EmotionEffect";
import styles from "./EmotionEffectTest.module.css"; // ✅ 올바른 CSS 파일명으로 수정

export default function TestPage() {
  // ✅ 강제로 탭 제목 변경
  useEffect(() => {
    document.title = "스마트미러 - 감정 테스트";
  }, []);

  return (
    <>
      <Head>
        <title>스마트미러 - 감정 테스트</title>
        <meta name="description" content="스마트미러 감정 테스트 모드 페이지입니다." />
      </Head>

      <div className={styles.emotionEffectContainer}>
        <h1>감정 테스트 모드</h1>
        <TestMode />
      </div>
    </>
  );
}
