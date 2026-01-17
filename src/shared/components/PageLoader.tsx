'use client';

import { useEffect, useState } from 'react';

interface PageLoaderProps {
	duration?: number;
}

export default function PageLoader({ duration = 300 }: PageLoaderProps) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timeout = setTimeout(() => setIsLoading(false), duration);
		return () => clearTimeout(timeout);
	}, [duration]);

	if (!isLoading) return null;

	return (
		<div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center transition-opacity duration-500 animate-fadeOut"></div>
	);
}
