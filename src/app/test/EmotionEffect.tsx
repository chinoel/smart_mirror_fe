"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import styles from "../test/EmotionEffectTest.module.css"; // ✅ CSS 확인

// 감정별 파티클 색상 설정
const emotionColors = {
  happy: "#FFD700", // 금색
  sad: "#1E90FF", // 밝은 파란색
  angry: "#FF4500", // 오렌지 레드
  annoyed: "#9400D3", // 보라색
  neutral: "#A9A9A9", // 연한 회색
};

// 감정 리스트
const emotionList = ["happy", "sad", "angry", "annoyed", "neutral"];

// 파티클 효과 컴포넌트 (얼굴 주위에 배치됨)
function EmotionParticles({ emotion }) {
  const ref = useRef();
  const geometryRef = useRef(new THREE.BufferGeometry());

  useEffect(() => {
    console.log(`🎭 감정 변경됨: ${emotion}`);

    const particles = new Float32Array(2000 * 3); // ✅ 파티클 개수 증가
    for (let i = 0; i < particles.length; i += 3) {
      const angle = Math.random() * Math.PI * 2; // ✅ 원형 배치
      const radius = 2 + Math.random() * 1.5; // ✅ 얼굴 주변 거리 조정
      particles[i] = Math.cos(angle) * radius; // ✅ X 좌표 (얼굴 주위)
      particles[i + 1] = (Math.random() - 0.5) * 3.0; // ✅ Y 좌표 (높이 조정)
      particles[i + 2] = Math.sin(angle) * radius; // ✅ Z 좌표 (원형 분포)
    }
    geometryRef.current.setAttribute("position", new THREE.BufferAttribute(particles, 3));

    console.log("✨ Particles Created:", particles);
  }, [emotion]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // ✅ 회전 효과 추가
      console.log("Particles Visible:", ref.current);
    }
  });

  return (
    <Points ref={ref} geometry={geometryRef.current} position={[0, 0, 0]}>
      <PointMaterial
        size={200} // ✅ 크기 증가 (눈에 띄도록)
        transparent
        depthTest={false} // ✅ 입자가 배경에 가려지지 않도록
        colorWrite={true} // ✅ WebGL에서 색상 강제 렌더링
        sizeAttenuation={false} // ✅ 크기 일정하게 유지
        color={new THREE.Color(emotionColors[emotion] || "white")}
      />
    </Points>
  );
}

export default function EmotionEffectTest() {
  const [emotion, setEmotion] = useState("neutral");

  useEffect(() => {
    // ✅ 4초마다 감정을 자동 변경
    const interval = setInterval(() => {
      const randomEmotion = emotionList[Math.floor(Math.random() * emotionList.length)];
      console.log("🎭 랜덤 감정 변경:", randomEmotion);
      setEmotion(randomEmotion);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.emotionEffectContainer}>
      <h2 className={styles.title}>🎭 감정 표현 테스트 (얼굴 주위 파티클 효과)</h2>

      <div className={styles.canvasContainer}>
        <Canvas
          gl={{ alpha: true }}
          style={{ width: "100%", height: "100%", backgroundColor: "black" }} // ✅ 배경 색 변경
        >
          <PerspectiveCamera makeDefault fov={75} position={[0, 0, 40]} /> {/* ✅ 카메라 위치 조정 */}
          <ambientLight intensity={3.0} />
          <pointLight position={[5, 5, 5]} />
          <EmotionParticles emotion={emotion} />
        </Canvas>
      </div>
    </div>
  );
}
