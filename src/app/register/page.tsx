"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "./Register.module.css";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>(""); // ✅ 비밀번호 강도 확인

  useEffect(() => {
    document.title = "스마트미러 - 회원가입";
  }, []);

  // ✅ 비밀번호 강도 체크 로직
  useEffect(() => {
    if (password.length < 6) {
      setPasswordStrength("❌ 너무 짧음");
    } else if (!/\d/.test(password)) {
      setPasswordStrength("⚠️ 숫자 포함 필요");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordStrength("⚠️ 대문자 포함 필요");
    } else {
      setPasswordStrength("✅ 안전한 비밀번호");
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("❌ 비밀번호가 일치하지 않습니다.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }

    if (passwordStrength.includes("❌") || passwordStrength.includes("⚠️")) {
      setMessage("❌ 비밀번호를 강화해주세요.");
      setShowMessage(true);
      return;
    }

    const userData = { email, password };
    localStorage.setItem("registeredUser", JSON.stringify(userData));

    setMessage("✅ 회원가입이 완료되었습니다! 🎉");
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      localStorage.setItem("loggedInUser", email); // ✅ 회원가입 후 자동 로그인
      router.push("/admin");
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>스마트미러 - 회원가입</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>회원가입</h1>

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
          {/* ✅ 비밀번호 강도 표시 */}
          <p className={styles.passwordStrength}>{passwordStrength}</p>

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>회원가입</button>
        </form>

        {showMessage && (
          <div className={`${styles.popup} ${message?.includes("완료") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
