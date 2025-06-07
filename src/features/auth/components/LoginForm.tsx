"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { setEncryptedToken, setUser as storeUser } from "@/shared/utils/storage";

// 1. 타입 선언
interface KakaoAuthResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

interface KakaoUserResponse {
  id: number;
  properties: {
    nickname: string;
  };
  kakao_account: {
    email?: string;
  };
}

// 2. window.Kakao 타입 안전하게 선언
declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          scope: string;
          success: (authObj: KakaoAuthResponse) => void;
          fail: (err: unknown) => void;
        }) => void;
      };
      API: {
        request: (options: {
          url: string;
          success: (res: KakaoUserResponse) => void;
          fail: (err: unknown) => void;
        }) => void;
      };
    };
  }
}

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKakaoLogin = () => {
    if (typeof window === "undefined" || !window.Kakao) return;

    const Kakao = window.Kakao;

    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "");
    }

    Kakao.Auth.login({
      scope: "profile_nickname",
      success: function (authObj) {
        console.log("카카오 로그인 성공", authObj);

        Kakao.API.request({
          url: "/v2/user/me",
          success: function (res) {
            const kakaoUser = {
              id: res.id,
              username: `kakao_${res.id}`,
              name: res.properties.nickname,
              password: "", // OAuth 로그인은 비밀번호 없음
            };

            setEncryptedToken(authObj.access_token);
            storeUser(kakaoUser);
            login(kakaoUser.username, ""); // 임시 로그인 흐름
            router.push("/dashboard");
          },
          fail: function (error) {
            console.error("카카오 유저 정보 요청 실패", error);
            setError("카카오 사용자 정보 요청에 실패했습니다.");
          },
        });
      },
      fail: function (err) {
        console.error("카카오 로그인 실패", err);
        setError("카카오 로그인에 실패했습니다.");
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md w-80"
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ID"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="PW"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>

        <button
          type="button"
          onClick={handleKakaoLogin}
          className="bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500"
        >
          카카오 로그인
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
