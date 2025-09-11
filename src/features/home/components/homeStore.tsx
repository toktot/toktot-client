'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useCategories } from '@/shared/hooks/useCategories';
import Icon from '@/shared/ui/Icon';

import api from '../lib/api';
import { CategoryItem } from './FoodIcon';
import StoreCardNew from './StoreCardNew';

interface PriceTabsProps {
	initialPrice?: number;
	initialFood?: string;
	onSelect?: (food: CategoryItem) => void;
	onChange?: (price: number, food: string) => void;
}
const priceRanges = [
	{ label: '만원이하', value: 0 },
	{ label: '1만원대', value: 10000 },
	{ label: '2~3만원대', value: 20000 },
	{ label: '3~5만원대', value: 30000 },
	{ label: '5~7만원대', value: 50000 },
	{ label: '7만원대 이상', value: 70000 },
];
interface GoodPriceStore {
	id: number;
	name: string;
	distance: string;
	main_menus: string;
	average_rating: number;
	address: string;
	review_count: number;
	is_good_price_store: boolean;
	is_local_store: boolean;
	image: string;
}

export default function PriceTabs({
	initialFood = '',
	onSelect,
	onChange,
}: PriceTabsProps) {
	const { categories } = useCategories();
	const router = useRouter();

	const [selectedFood, setSelectedFood] = useState<CategoryItem | null>(
		categories?.find((cat) => cat.name === initialFood) || null,
	);
	const [activeTab, setActiveTab] = useState(priceRanges[0]);

	const handleSelect = (
		food: CategoryItem | null,
		price: (typeof priceRanges)[0],
	) => {
		setSelectedFood(food);
		setActiveTab(price);
		if (onChange) onChange(price.value, food?.name || '');
	};
	const [stores, setStores] = useState<GoodPriceStore[]>([]);
	const [loading, setLoading] = useState(false);
	console.log(loading);
	const handleClick = (item: CategoryItem) => {
		setSelectedFood(item);
		if (onSelect) onSelect(item);
		router.push(`/search?q=${encodeURIComponent(item.name)}`);
	};
	const fetchStores = async (priceValue: number, foodName: string) => {
		setLoading(true);
		try {
			const response = await api.get('/v1/restaurants/good-price', {
				params: {
					priceRange: priceValue || 0,
					latitude: 33.4996, // 필요에 따라 사용자 위도
					longitude: 126.5312, // 필요에 따라 사용자 경도
					page: 0,
					size: 20,
				},
			});
			const data = response.data;
			if (data?.data?.content) {
				let list = data.data.content;

				// 음식 선택 시 간단 필터 (백엔드에서 음식 필터를 지원하면 제거 가능)
				if (foodName) {
					list = list.filter((store: GoodPriceStore) =>
						store.main_menus.includes(foodName),
					);
				}

				setStores(list.slice(0, 3)); // 최대 3개만 보여주기
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchStores(activeTab.value, selectedFood?.name || '');
		//근데 가격대에 상관없이 api 주소는
	}, [activeTab.value, selectedFood?.name]);
	return (
		//아 아니에요 그 priceRange로 값 다 다르게 가고 있어요 네 그 parameter로 {}이거 넘겨주면
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
								onClick={() => handleSelect(selectedFood, range)}
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
			<div className="overflow-x-auto mb-4 justify-start scrollbar-hide justify-center items-center">
				<div className="inline-flex gap-4 whitespace-nowrap">
					{categories?.map((cat) => (
						<div key={cat.id} className="flex flex-col items-center w-[60px]">
							{/* 네모 + 아이콘 버튼 */}
							<button
								className="w-[60px] h-[60px] flex items-center justify-center rounded-xl bg-grey-20"
								onClick={() => handleClick(cat)}
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
				{stores.map((store) => (
					<StoreCardNew key={store.id} review={store} />
				))}
			</div>
		</section>
	);
}
