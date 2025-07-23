'use client';

import { useAuth } from '@/features/auth/context/AuthProvider';

export default function Dashboard() {
	const { user, logout } = useAuth();

	return (
		<div className="p-10">
			<h1 className="text-xl">안녕하세요, {user?.name}님</h1>
			<button
				onClick={logout}
				className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
			>
				로그아웃
			</button>
		</div>
	);
}
