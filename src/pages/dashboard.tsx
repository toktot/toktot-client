import ProtectedRoute from "@/shared/routes/ProtectedRoute";
import { useAuth } from "@/features/auth/context/AuthProvider";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <main>
        <h1>환영합니다, {user?.name}</h1>
        <button onClick={logout}>로그아웃</button>
      </main>
    </ProtectedRoute>
  );
}
