'use client';

import { Suspense } from 'react';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import PriceChart from '@/features/menuPrice/components/Graph';
import Header from '@/features/menuPrice/components/Header';

export default function MenuPricePage() {
	return (
		<HomeAppShell showBottomNav={true}>
			<main className="relative">
				<Suspense fallback={<div>로딩 중...</div>}>
					<main className="flex flex-col h-screen">
						<Header />
						<div className=" bg-white flex-1 overflow-y-auto scrollbar-hide">
							<PriceChart />
						</div>
					</main>
				</Suspense>
			</main>
		</HomeAppShell>
	);
}
