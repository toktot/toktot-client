'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import PriceTabs from '@/features/home/components/homeStore';

import { getDecryptedToken } from '@/shared/utils/storage';


export default function GoodstoreClient() {
	const searchParams = useSearchParams();

	const initialPrice = Number(searchParams.get('price') || 0);
	const initialFood = searchParams.get('food') || '';

	const [selectedPrice, setSelectedPrice] = useState(initialPrice);
	const [selectedFood, setSelectedFood] = useState(initialFood);
	
	console.log(setSelectedPrice);
	const router = useRouter();

	useEffect(() => {
		const token = getDecryptedToken();
		if (!token) {
			router.replace('/login');
		}
	}, [router]);


	return (
		<HomeAppShell showBottomNav={true}>
			<main className="flex flex-col h-screen pb-[80px]">
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<section className="bg-white px-4 py-4">
						<div className="mt-8 flex items-center justify-between mb-4">
							<h2 className="text-[18px] font-semibold">
								가격도 착하고 맛까지 좋은 가게는?
							</h2>
						</div>
						<PriceTabs
  initialPrice={selectedPrice}
  initialFood={selectedFood}
  onChange={(priceValue, foodName) => {
    setSelectedPrice(priceValue);
    setSelectedFood(foodName);
  }}
  limit={null}      // 더보기: 전부
  pageSize={100}    // 한 번에 크게
/>
					</section>
				</div>
			</main>
		</HomeAppShell>
	);
}
