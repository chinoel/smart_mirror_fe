"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import styles from "@/styles/EmotionEffect.module.css";

// 감정별 파티클 색상 설정
const emotionColors = {
  happy: "yellow",
  sad: "blue",
  angry: "red",
  annoyed: "purple",
  neutral: "gray",
};

// 파티클 효과 컴포넌트
function EmotionParticles({ emotion }) {
  const ref = useRef();
  const particles = useRef(new Float32Array(500 * 3)).current;

  useEffect(() => {
    for (let i = 0; i < particles.length; i++) {
      particles[i] = (Math.random() - 0.5) * 4; // 랜덤한 위치 배치
    }
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // 천천히 회전하는 효과
    }
  });

  return (
    <Points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial size={0.1} color={new THREE.Color(emotionColors[emotion] || "white")} />
    </Points>
  );
}

export default function EmotionEffect() {
  const [emotion, setEmotion] = useState("neutral");
  const [visible, setVisible] = useState(false);

  const triggerEmotion = (newEmotion) => {
    setEmotion(newEmotion);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000); // 3초 후 사라짐
  };

  return (
    <div className={styles.emotionEffectContainer}>
      <div className={styles.testButtons}>
        <button onClick={() => triggerEmotion("happy")}>😀 기쁨</button>
        <button onClick={() => triggerEmotion("sad")}>😢 슬픔</button>
        <button onClick={() => triggerEmotion("angry")}>😡 화남</button>
        <button onClick={() => triggerEmotion("annoyed")}>😤 짜증</button>
        <button onClick={() => triggerEmotion("neutral")}>😐 중립</button>
      </div>

      {visible && (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} />
          <EmotionParticles emotion={emotion} />
        </Canvas>
      )}
    </div>
  );
}
