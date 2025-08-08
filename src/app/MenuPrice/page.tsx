'use client';

import { Suspense } from 'react';

import PriceChart from '@/features/menuPrice/components/Graph';
import Header from '@/features/menuPrice/components/Header';

export default function MenuPricePage() {
	return (
		<main>
			<Suspense fallback={<div>로딩 중...</div>}>
				<Header />

				<PriceChart />
			</Suspense>
		</main>
	);
}
