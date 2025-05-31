"use client";

import { useState, useEffect } from "react";

interface ThirdPageProps {
  isPreloading?: boolean;
}

export default function ThirdPage({ isPreloading = false }: ThirdPageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // 이미지 경로를 바로 설정 (API 호출 없이 public 폴더에서)
    setImageUrl("/images/scholarship.jpg");
  }, []);

  // 프리로딩 중일 때는 아무것도 렌더링하지 않음
  if (isPreloading) {
    return null;
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="국가장학금 신청 안내"
          className="max-w-[90%] max-h-[90%] object-contain"
        />
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
}
