"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Admin.module.css";

export default function AdminNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [newNotice, setNewNotice] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8888/api/admin/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("공지사항 데이터 불러오기 오류:", error);
      }
    };
    fetchNotifications();
  }, []);

  const handleAddNotice = async () => {
    if (!newNotice.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8888/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newNotice }),
      });

      if (response.ok) {
        setNotifications([...notifications, { message: newNotice, date: new Date().toISOString() }]);
        setNewNotice("");
      } else {
        console.error("서버 응답 오류:", await response.text());
      }
    } catch (error) {
      console.error("공지 추가 오류:", error);
    }
  };

  return (
    <>
      <Head>
        <title>공지사항 관리</title>
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

        <main className={styles.dashboard} style={{ color: "black" }}>
          <h1 style={{ color: "black" }}>📢 공지사항 관리</h1>

          {/* 공지 추가 */}
          <textarea
            className={styles.textArea}
            placeholder="새 공지를 입력하세요..."
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            style={{ color: "black" }}
          />
          <button className={styles.addButton} onClick={handleAddNotice}>공지 추가</button>


          {/* 공지 목록 */}
          <ul className={styles.noticeList}>
            {notifications.length > 0 ? (
              notifications.map((notice, index) => (
                <li key={index} className={styles.noticeItem} style={{ color: "black" }}>
                  {notice.message} - {new Date(notice.date).toLocaleString()}
                </li>
              ))
            ) : (
              <li className={styles.noticeItem} style={{ color: "black" }}>
                등록된 공지사항이 없습니다.
              </li>
            )}
          </ul>
        </main>
      </div>
    </>
  );
}
