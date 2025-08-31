'use client';

import { Suspense, useState } from 'react';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import PriceChart from '@/features/menuPrice/components/Graph';
import Header from '@/features/menuPrice/components/Header';

export default function MenuPricePage() {
	const [showGuide, setShowGuide] = useState(true);
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

				{showGuide && (
					<div
						className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50"
						onClick={() => setShowGuide(false)}
					>
						<div className="flex flex-col items-center text-center text-white">
							<div className="relative flex items-center justify-center">
								<div className="absolute -left-12 flex space-x-[-20px] opacity-70">
									<div className="w-[40px] h-[40px] rounded-full bg-cyan-400 opacity-50"></div>
									<div className="w-[48px] h-[48px] rounded-full bg-cyan-400"></div>
								</div>
								<div className="bg-primary-40 rounded-full w-[70px] h-[70px] flex items-center justify-center relative z-10">
									<span className="text-2xl text-black">{'↔'}</span>
								</div>
								<div className="absolute -right-12 flex space-x-[-20px] opacity-70">
									<div className="w-[48px] h-[48px] rounded-full bg-cyan-400"></div>
									<div className="w-[40px] h-[40px] rounded-full bg-cyan-400 opacity-50"></div>
								</div>
							</div>

							<p className="text-lg font-medium mt-2">좌우로 이동해</p>
							<p className="text-lg font-medium">
								구간별 가격/가게 정보를 확인해보세요
							</p>
						</div>
					</div>
				)}
			</main>
		</HomeAppShell>
	);
}
