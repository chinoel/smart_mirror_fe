"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFount() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000);
     
  }, [router]);

  return (
    <>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>Redirecting to home...</p>
      </div>
    </>
  );
}