"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styles from "@/styles/Register.module.css";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // ✅ 이메일 입력 상태
  const [password, setPassword] = useState(""); // ✅ 비밀번호 입력 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ 비밀번호 확인 상태
  const [message, setMessage] = useState<string | null>(null); // ✅ 회원가입 결과 메시지
  const [showMessage, setShowMessage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>(""); // ✅ 비밀번호 강도 확인
  const [isChecking, setIsChecking] = useState<boolean>(false); // ✅ 이메일 중복 확인 상태
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null); // ✅ 이메일 사용 가능 여부

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

  // ✅ 이메일 중복 확인 API 호출 (백엔드 연동)
  const checkEmailAvailability = async () => {
    if (!email) return;
    setIsChecking(true);

    try {
      // 🎯 백엔드에서 이메일 중복 확인 API 구현 필요
      const response = await fetch(`http://localhost:8888/api/check-email?email=${email}`, {
        method: "GET",
      });

      const data = await response.json();
      setIsEmailAvailable(data.available); // ✅ 백엔드 응답이 `available: true`면 사용 가능
    } catch (error) {
      console.error("이메일 중복 확인 오류:", error);
      setIsEmailAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  // ✅ 회원가입 API 요청 (백엔드 연동)
  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // 🎯 백엔드에서 회원가입 API 구현 필요
      const response = await fetch("http://localhost:8888/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ 회원가입이 완료되었습니다! 🎉");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          router.push("/login"); // ✅ 회원가입 후 로그인 페이지로 이동
        }, 1500);
      } else {
        setMessage(`❌ 오류: ${data.message || "회원가입에 실패했습니다."}`);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    } catch (error) {
      console.error("회원가입 요청 오류:", error);
      setMessage("❌ 서버 오류가 발생했습니다.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>스마트미러 - 회원가입</title>
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>회원가입</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ✅ 이메일 입력 & 중복 확인 */}
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="button" onClick={checkEmailAvailability} className={styles.checkButton} disabled={isChecking}>
              {isChecking ? "확인 중..." : "중복 확인"}
            </button>
          </div>
          {isEmailAvailable !== null && (
            <p className={isEmailAvailable ? styles.available : styles.unavailable}>
              {isEmailAvailable ? "✅ 사용 가능한 이메일입니다." : "❌ 이미 사용 중인 이메일입니다."}
            </p>
          )}

          {/* ✅ 비밀번호 입력 */}
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

        {/* ✅ 회원가입 성공 or 오류 메시지 팝업 */}
        {showMessage && (
          <div className={`${styles.popup} ${message?.includes("완료") ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </>
  );
}
