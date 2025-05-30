// /pages/_app.tsx
import type { AppProps } from "next/app";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
