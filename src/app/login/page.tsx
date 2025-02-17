"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"; // ✅ `next/head` 사용
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "password123";

  // ✅ 동적으로 문서 제목 변경
  useEffect(() => {
    document.title = "스마트미러 - 관리자 로그인";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setMessage(`${email}님, 환영합니다! 🎉`);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        router.push("/admin");
      }, 1500);
    } else {
      setMessage("❌ 로그인에 실패했습니다.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <>
      {/* ✅ `next/head` 사용하여 탭 제목 설정 */}
      <Head>
        <title>스마트미러 - 관리자 로그인</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>관리자 로그인</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>로그인</button>
        </form>

        {/* ✅ 로그인 성공 또는 실패 메시지 팝업 */}
        {showMessage && (
          <div className={`${styles.popup} ${message?.includes("환영") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
