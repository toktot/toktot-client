'use client';

import { Suspense } from 'react';

import SearchResultSection from '@/features/home/components/SearchResultSection';

export default function SearchPage() {
	return (
		<Suspense fallback={<div>헤더 로딩 중...</div>}>
			<SearchResultSection />
		</Suspense>
	);
}
