// /pages/_app.tsx
// src/pages/_app.tsx
import { useEffect } from "react";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const kakaoScript = document.createElement("script");
    kakaoScript.src = "https://developers.kakao.com/sdk/js/kakao.js";
    kakaoScript.async = true;
    document.head.appendChild(kakaoScript);
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
