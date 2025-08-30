'use client';

import { useMemo, useState } from 'react';

import { Store, mockStores } from '@/entities/store/model/mockStore';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

import { CategoryItem } from './FoodIcon';
import StoreCardNew from './StoreCardNew';

const priceRanges = [
	{ label: '1만원대', min: 10000, max: 19999 },
	{ label: '2~3만원대', min: 20000, max: 39999 },
	{ label: '3~5만원대', min: 30000, max: 49999 },
	{ label: '5~7만원대', min: 50000, max: 69999 },
	{ label: '7만원대 이상', min: 70000, max: 1000000 },
];

export default function PriceTabs() {
	const { categories } = useCategories();

	const [selectedFood, setSelectedFood] = useState<CategoryItem | null>(null);
	const [activeTab, setActiveTab] = useState(priceRanges[0]);

	const filteredStores: Store[] = useMemo(() => {
		return mockStores.filter((store) => {
			const firstPrice = store.menuPrices?.[0]?.price;
			if (!firstPrice) return false;

			const inPriceRange =
				firstPrice >= activeTab.min && firstPrice <= activeTab.max;
			const hasSelectedFood = selectedFood?.name
				? store.mainMenus?.includes(selectedFood.name)
				: true;

			return inPriceRange && hasSelectedFood;
		});
	}, [activeTab, selectedFood]);

	return (
		<section>
			<div className="relative mb-4 overflow-x-auto scrollbar-hide">
				{/* 기본 선 (전체 w-full, grey-20) */}
				<div className="absolute bottom-0 left-0 w-full h-[2px] bg-grey-20" />

				<div className="flex gap-2 flex-nowrap ">
					{priceRanges.map((range) => {
						const isActive = activeTab.label === range.label;
						return (
							<button
								key={range.label}
								className={`flex-shrink-0 relative px-4 py-2 text-sm font-medium
						${isActive ? 'text-grey-90' : 'text-grey-40'}
					`}
								onClick={() => setActiveTab(range)}
							>
								{range.label}

								{/* 활성화된 탭 밑줄 */}
								{isActive && (
									<span className="absolute bottom-0 left-4 w-[48px] h-[2px] bg-grey-90" />
								)}
							</button>
						);
					})}
				</div>
			</div>
			{/* 탭 버튼 */}
			{/* 탭 버튼 */}
			<div className="overflow-x-auto mb-4 justify-start scrollbar-hide">
				<div className="inline-flex gap-4 whitespace-nowrap">
					{categories?.map((cat) => (
						<div key={cat.id} className="flex flex-col items-center w-[60px]">
							{/* 네모 + 아이콘 버튼 */}
							<button
								className="w-[60px] h-[60px] flex items-center justify-center rounded-xl bg-grey-20"
								onClick={() => setSelectedFood(cat)}
							>
								<Icon name={cat.icon} className="w-10 h-10" />
							</button>

							{/* 글자 (버튼 밖, 아래) */}
							<span className="mt-1 text-xs text-grey-90 text-center">
								{cat.name}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* 가게 카드들 */}
			<div className="flex flex-col gap-4 justify-center items-center">
				{filteredStores.map((store) => (
					<StoreCardNew key={store.id} review={store} />
				))}
			</div>
		</section>
	);
}
