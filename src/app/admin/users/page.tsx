"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Admin.module.css";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://백엔드서버주소/api/admin/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("사용자 데이터 불러오기 오류:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Head>
        <title>사용자 관리</title>
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
          <h1 style={{ color: "black" }}>👤 사용자 관리</h1>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th style={{ color: "black" }}>이름</th>
                <th style={{ color: "black" }}>이메일</th>
                <th style={{ color: "black" }}>권한</th>
                <th style={{ color: "black" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: "black" }}>{user.name}</td>
                    <td style={{ color: "black" }}>{user.email}</td>
                    <td style={{ color: "black" }}>{user.role}</td>
                    <td>
                      <button className={styles.editButton}>수정</button>
                      <button className={styles.deleteButton}>삭제</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ color: "black" }}>등록된 사용자가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
