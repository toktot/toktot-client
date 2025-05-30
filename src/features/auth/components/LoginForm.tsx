"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md w-80"
      >
        <div className="flex flex-col gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ID"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <div className="flex flex-col gap-2">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="PW"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          로그인
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
