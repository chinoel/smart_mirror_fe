<<<<<<< HEAD
export default function Login() {
  return (
    <>
      Login
    </>
  );
}
=======
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"; // ✅ `next/head` 사용
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState(""); // ✅ 이메일 입력 상태
  const [password, setPassword] = useState(""); // ✅ 비밀번호 입력 상태
  const [showPassword, setShowPassword] = useState(false); // ✅ 비밀번호 보기 토글
  const [message, setMessage] = useState<string | null>(null); // ✅ 로그인 결과 메시지
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();

  // ✅ 동적으로 문서 제목 변경
  useEffect(() => {
    document.title = "스마트미러 - 관리자 로그인";
  }, []);

  // ✅ 로그인 API 요청 (백엔드 연동)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      // 🎯 백엔드 로그인 API 호출 (팀원이 구현할 부분)
      const response = await fetch("http://백엔드서버주소/api/login", {
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
        // ✅ JWT 토큰 저장 (백엔드에서 토큰을 발급해야 함)
        localStorage.setItem("token", data.token);

        setMessage(`${email}님, 환영합니다! 🎉`);
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          router.push("/admin"); // ✅ 로그인 성공 시 관리자 페이지로 이동
        }, 1500);
      } else {
        setMessage(`❌ 오류: ${data.message || "로그인에 실패했습니다."}`);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      setMessage("❌ 서버 오류가 발생했습니다.");
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

        {/* ✅ 로그인 폼 */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ✅ 이메일 입력 */}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          {/* ✅ 비밀번호 입력 (토글 기능 포함) */}
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
            >
              {showPassword ? "🙈" : "👀"}
            </button>
          </div>
          <button type="submit" className={styles.button}>로그인</button>
        </form>

        {/* ✅ 회원가입 버튼 (계정이 없는 경우) */}
        <div className={styles.registerContainer}>
          <p className={styles.registerText}>계정이 없으신가요?</p>
          <button onClick={() => router.push("/register")} className={styles.registerButton}>
            회원가입
          </button>
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
>>>>>>> main
