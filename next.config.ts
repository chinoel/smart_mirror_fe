import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ React Strict Mode 활성화
  trailingSlash: true,   // ✅ URL 끝에 슬래시 추가
  output: "standalone",  // ✅ 독립 실행 가능하도록 설정
  experimental: {},       // ✅ 실험적 기능을 위한 빈 객체 유지
};

export default nextConfig;
