'use client';

import { Suspense } from 'react';

import SearchResultSection from '@/widgets/home/ui/SearchResultSection';

export default function SearchPage() {
	return (
		<Suspense fallback={<div>헤더 로딩 중...</div>}>
			<SearchResultSection />
		</Suspense>
	);
}
