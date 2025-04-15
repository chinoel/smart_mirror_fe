"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Admin.module.css";

export default function AdminPages() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>관리자 페이지</title>
      </Head>
      <div className={styles.adminContainer}>
        {/* ✅ 사이드바 (리디자인 적용) */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>관리자 메뉴</h2>
          <ul>
            <li className={styles.menuItem} onClick={() => router.replace("/admin/dashboard")}>📊 대시보드</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/users")}>👤 사용자 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/notifications")}>📢 공지사항 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/meals")}>🍽️ 식단표 관리</li>
          </ul>
        </aside>

        {/* ✅ 동적 페이지 렌더링 */}
        <main className={styles.dashboard}>
          <header className={styles.header}>
            <h1>📊 관리자 페이지</h1>
            <button onClick={() => router.push("/login")} className={styles.logoutButton}>🚪 로그아웃</button>
          </header>

          <div className={styles.dashboardContent}>
            {/* ✅ 방문자 수 */}
            <section className={styles.card}>
              <h2>👥 방문자 수</h2>
              <p>오늘 방문자: <strong>120명</strong></p>
              <canvas id="visitorChart"></canvas>
            </section>

            {/* ✅ 현재 공지사항 */}
            <section className={styles.card}>
              <h2>📢 최근 공지사항</h2>
              <p>현재 공지: "스마트미러 업데이트 예정"</p>
              <button onClick={() => router.push("/admin/notifications")} className={styles.editButton}>수정하기</button>
            </section>

            {/* ✅ 오늘의 식단 */}
            <section className={styles.card}>
              <h2>🍽️ 오늘의 식단</h2>
              <p>아침: 김치찌개 & 밥</p>
              <p>점심: 돈까스 & 샐러드</p>
              <p>저녁: 된장찌개 & 생선구이</p>
              <button onClick={() => router.push("/admin/meals")} className={styles.editButton}>수정하기</button>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}