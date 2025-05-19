"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Admin.module.css";

export default function AdminMeals() {
  const router = useRouter();
  const [meals, setMeals] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [images, setImages] = useState({ breakfast: null, lunch: null, dinner: null });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:8888/api/admin/meals/today");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("식단표 데이터 불러오기 오류:", error);
      }
    };
    fetchMeals();
  }, []);

  // ✅ 식단 저장 기능
  const handleSaveMeals = async () => {
    try {
      const response = await fetch("http://localhost:8888/api/admin/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meals),
      });

      if (response.ok) {
        alert("✅ 식단이 저장되었습니다!");
      }
    } catch (error) {
      console.error("식단 저장 오류:", error);
    }
  };

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (mealType, event) => {
    const file = event.target.files[0];
    setImages((prev) => ({ ...prev, [mealType]: file }));
  };

  return (
    <>
      <Head>
        <title>식단표 관리</title>
      </Head>
      <div className={styles.adminContainer}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>관리자 메뉴</h2>
          <ul>
            <li className={styles.menuItem} onClick={() => router.push("/admin/dashboard")}>📊 대시보드</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/users")}>👤 사용자 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/notifications")}>📢 공지사항 관리</li>
            <li className={styles.menuItem} onClick={() => router.push("/admin/meals")}>🍽️ 식단표 관리</li>
          </ul>
        </aside>

        <main className={styles.dashboard}>
          <h1>🍽️ 식단표 관리</h1>

          {/* ✅ 식단 입력 */}
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <div key={meal} className={styles.mealItem}>
              <label>{meal === "breakfast" ? "🍚 아침" : meal === "lunch" ? "🍛 점심" : "🍲 저녁"}</label>
              <input
                type="text"
                value={meals[meal]}
                onChange={(e) => setMeals((prev) => ({ ...prev, [meal]: e.target.value }))} 
              />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(meal, e)} />
            </div>
          ))}

          <button onClick={handleSaveMeals} className={styles.saveButton}>💾 저장</button>
        </main>
      </div>
    </>
  );
}
