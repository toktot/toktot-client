import { Suspense, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { HomeAppShell } from '@/widgets/layout/ui/HomeAppShell';

import PriceTabs from '@/features/home/components/homeStore';

import { getDecryptedToken } from '@/shared/utils/storage';

export default function HomeContainer() {
	const searchParams = useSearchParams();

	const initialPrice = searchParams.get('price') || '';
	const initialFood = searchParams.get('food') || '';

	const [selectedPrice, setSelectedPrice] = useState(initialPrice);
	const [selectedFood, setSelectedFood] = useState(initialFood);
	const router = useRouter();

	useEffect(() => {
		const token = getDecryptedToken();
		console.log('Token', token);
		console.log(token);
		if (!token) {
			router.replace('/login');
		}
	}, [router]);
	const handleFilterSelect = (price: string, food: string) => {
		setSelectedPrice(price);
		setSelectedFood(food);
	};

	return (
		<HomeAppShell showBottomNav={true}>
			<Suspense fallback={<div>Loading...</div>}>
				<main className="flex flex-col h-screen">
					<div className="flex-1 overflow-y-auto scrollbar-hide">
						<section className="  bg-white px-4 py-4">
							{/* 상단 제목 + 더보기 */}

							{/* 가격 + 음식 필터 */}
							<div className="mt-8 flex items-center justify-between mb-4">
								<h2 className="text-[18px] font-semibold">
									가격도 착하고 맛까지 좋은 가게는?
								</h2>
							</div>
							<PriceTabs
								initialPrice={selectedPrice}
								initialFood={selectedFood}
								onSelect={handleFilterSelect}
							/>
						</section>
					</div>
				</main>
			</Suspense>
		</HomeAppShell>
	);
}
