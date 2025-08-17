'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/AuthProvider';

export default function Dashboard() {
	const { user, logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push('/login'); // 인증 안 됐으면 로그인 페이지로 이동
		}
	}, [user, router]);

	if (!user) return null; // or <Loading />

	return (
		<div className="p-10">
			<h1 className="text-xl">
				안녕하세요, {user.nickname || user.username || '사용자'}님
			</h1>
			<button
				onClick={logout}
				className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
			>
				로그아웃
			</button>
		</div>
	);
}
