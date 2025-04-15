"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Admin.module.css";

export default function DashboardPage() {
  const router = useRouter();

  // ✅ 상태 관리 (방문자 수, 공지사항, 식단표)
  const [visitors, setVisitors] = useState(0);
  const [latestNotice, setLatestNotice] = useState("");
  const [meals, setMeals] = useState({ breakfast: "", lunch: "", dinner: "" });

  // ✅ 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [visitorRes, noticeRes, mealRes] = await Promise.all([
          fetch("http://백엔드서버주소/api/admin/visitors"),
          fetch("http://백엔드서버주소/api/admin/notifications/latest"),
          fetch("http://백엔드서버주소/api/admin/meals/today"),
        ]);

        const [visitorData, noticeData, mealData] = await Promise.all([
          visitorRes.json(),
          noticeRes.json(),
          mealRes.json(),
        ]);

        if (visitorRes.ok) setVisitors(visitorData.count);
        if (noticeRes.ok) setLatestNotice(noticeData.message);
        if (mealRes.ok) setMeals(mealData);
      } catch (error) {
        console.error("대시보드 데이터 불러오기 오류:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>📊 관리자 대시보드</title>
      </Head>

      <div className={styles.adminContainer}>
        {/* ✅ 사이드바 */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>관리자 메뉴</h2>
          <ul>
            <li className={styles.menuItem} onClick={() => router.push("/admin/dashboard")}>📊 대시보드</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/users")}>👤 사용자 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/notifications")}>📢 공지사항 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/meals")}>🍽️ 식단표 관리</li>
          </ul>
        </aside>

        {/* ✅ 대시보드 메인 컨텐츠 */}
        <main className={styles.dashboard}>
          <header className={styles.header}>
            <h1>📊 관리자 대시보드</h1>
            <button onClick={() => router.push("/login")} className={styles.logoutButton}>🚪 로그아웃</button>
          </header>

          <div className={styles.dashboardContent}>
            {/* ✅ 방문자 수 */}
            <section className={styles.card}>
              <h2>👥 방문자 수</h2>
              <p>오늘 방문자: <strong>{visitors}명</strong></p>
            </section>

            {/* ✅ 최근 공지사항 */}
            <section className={styles.card}>
              <h2>📢 최근 공지사항</h2>
              <p>현재 공지: "{latestNotice || "공지 없음"}"</p>
              <button onClick={() => router.push("/admin/notifications")} className={styles.editButton}>수정하기</button>
            </section>

            {/* ✅ 오늘의 식단 */}
            <section className={styles.card}>
              <h2>🍽️ 오늘의 식단</h2>
              <p>아침: {meals.breakfast || "없음"}</p>
              <p>점심: {meals.lunch || "없음"}</p>
              <p>저녁: {meals.dinner || "없음"}</p>
              <button onClick={() => router.push("/admin/meals")} className={styles.editButton}>수정하기</button>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
