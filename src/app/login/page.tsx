"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"; // ✅ `next/head` 사용
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "스마트미러 - 관리자 로그인";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const storedUser = localStorage.getItem("registeredUser");
    if (storedUser) {
      const { email: storedEmail, password: storedPassword } = JSON.parse(storedUser);

      if (email === storedEmail && password === storedPassword) {
        setMessage(`${email}님, 환영합니다! 🎉`);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          router.push("/admin");
        }, 1500);
      } else {
        setMessage("❌ 이메일 또는 비밀번호가 틀렸습니다.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    } else {
      setMessage("❌ 등록된 계정이 없습니다.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <>
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
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.togglePassword}>
              {showPassword ? "🙈" : "👀"}
            </button>
          </div>
          <button type="submit" className={styles.button}>로그인</button>
        </form>

        {/* ✅ 회원가입 버튼 */}
        <div className={styles.registerContainer}>
          <p className={styles.registerText}>계정이 없으신가요?</p>
          <button onClick={() => router.push("/register")} className={styles.registerButton}>회원가입</button>
        </div>

        {/* ✅ 로그인 성공 또는 실패 메시지 */}
        {showMessage && (
          <div className={`${styles.popup} ${message?.includes("환영") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
