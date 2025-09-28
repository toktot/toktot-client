// components/PageLoader.tsx
'use client';

import { useEffect, useState } from 'react';

// components/PageLoader.tsx

interface PageLoaderProps {
	duration?: number; // 로딩 유지 시간 (ms)
}

export default function PageLoader({ duration = 300 }: PageLoaderProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => setIsLoading(false), duration);
		return () => clearTimeout(timeout);
	}, [duration]);

	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center transition-opacity duration-500 animate-fadeOut">
			{/* 원하면 로딩 아이콘 추가 가능 */}
		</div>
	);
}
