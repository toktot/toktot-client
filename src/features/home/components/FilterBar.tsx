'use client';

import { useEffect, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mealOptions } from '@/entities/home/model/mockMealOptions';
import clsx from 'clsx';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useCurrentLocation } from '@/shared/location/lib/useCurrentLocation';
import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

import SortDropdown from '../model/SortDropDown';

export type FilterKey = 'distance' | 'rating' | 'goodstore' | 'openrun';
type FilterItem = {
	label: string;
	value: number;
	active?: boolean;
};

const filterItems: FilterItem[] = [
	{ label: '거리', value: 0 },
	{ label: '별점', value: 1 },
	{ label: '향토음식', value: 2 },
	{ label: '가격', value: 3 },
	{ label: '음식', value: 4 },
	{ label: '서비스', value: 5 },
	{ label: '청결', value: 6 },
	{ label: '분위기', value: 7 },
	{ label: '주차공간', value: 8 },
	{ label: '시간', value: 9 },
] as const;

interface Props {
	value: number | null;
	onChange: (val: number | null) => void;
	onClick: () => void;
	onSummaryChange?: (summary: string) => void;
	onSortChange?: (
		sort: 'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION',
	) => void;
	locationAvailable?: boolean;
}
const JEJU_BOUNDS = {
		latMin: 33.0,
		latMax: 33.7,
		lngMin: 126.0,
		lngMax: 127.0,
	};
const isInJeju = (lat: number, lng: number) =>
		lat >= JEJU_BOUNDS.latMin &&
		lat <= JEJU_BOUNDS.latMax &&
		lng >= JEJU_BOUNDS.lngMin &&
		lng <= JEJU_BOUNDS.lngMax;

const FilterBar: React.FC<Props> = ({
	value,
	onChange,
	onClick,
	onSortChange,
}) => {
	const [filterTags, setFilterTags] = useState<string[]>([]);
	const router = useRouter();
	const searchParams = useSearchParams();
	

	
	const [displayItems, setDisplayItems] = useState(filterItems);
	const [isQueryActive, setIsQueryActive] = useState(false);
	console.log(setIsQueryActive);
	const [mealTimeState, setMealTimeState] = useState<string | null>(null);
	const { location } = useCurrentLocation();
	const [canUseDistanceSort, setCanUseDistanceSort] = useState(false);
	const [locationAllowedBrowser, setLocationAllowedBrowser] = useState(false);
	useEffect(() => {
		setMealTimeState(searchParams.get('mealTime'));
	}, [searchParams]);

	useEffect(() => {
		if (!navigator.geolocation) {
			console.log('브라우저에서 Geolocation 지원 안함');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				console.log('위치 허용됨', position.coords);
				setLocationAllowedBrowser(true);
			},
			(error) => {
				console.log('위치 허용 거부됨', error);
				setLocationAllowedBrowser(false);
			},
		);
	}, []);

	// 2. 위치가 제주도인지 확인
	useEffect(() => {
		if (location?.coords) {
			const { latitude, longitude } = location.coords;
			setCanUseDistanceSort(isInJeju(latitude, longitude));
		} else {
			setCanUseDistanceSort(false);
		}
	}, [location]);

	// 3. sortOption 설정 (브라우저 허용 + 제주도)
	useEffect(() => {
		setSortOption(
			locationAllowedBrowser && canUseDistanceSort
				? 'DISTANCE'
				: 'SATISFACTION',
		);
	}, [locationAllowedBrowser, canUseDistanceSort]);

	const [sortOption, setSortOption] = useState<
		'DISTANCE' | 'POPULARITY' | 'RATING' | 'SATISFACTION'
	>('SATISFACTION');

	const handleSortSelect = (option: typeof sortOption) => {
		setSortOption(option);
		if (onSortChange) onSortChange(option);
	};
	const distance = searchParams.get('distance');
	const rating = Number(searchParams.get('rating') ?? 0);
	const menu = searchParams.get('menu');
	const minPrice = searchParams.get('minPrice');
	const maxPrice = searchParams.get('maxPrice');
	const mealTime = searchParams.get('meal');
	console.log(filterTags, isQueryActive);

	useEffect(() => {
		const updatedItems = filterItems.map((item) => {
			let label = item.label;
			let active = false;
			switch (item.value) {
				case 0:
					if (distance) {
						label = `${distance}m 이내`;
						active = true;
					}
					break;
				case 1:
					if (rating) {
						label = `${rating}점 이상`;
						active = true;
					}
					break;
				case 2:
					if (menu) {
						label = `${menu} `;
						active = true;
					}

					if (minPrice && maxPrice) {
						label += `${minPrice} ~ ${maxPrice} 만원`;
						active = true;
					}

					break;
				case 3: // 가격
				case 4: // 음식
				case 5: // 서비스
				case 6: // 청결
				case 7: // 분위기
				case 8: // 주차공간
					const categoryIdMap: Record<number, string> = {
						3: 'price',
						4: 'food',
						5: 'service',
						6: 'clean',
						7: 'mood',
						8: 'parking',
					};

					const categoryId = categoryIdMap[item.value];
					const raw = searchParams.get(categoryId);
					if (raw) {
						const ids = raw.split(',').map(Number);
						const category = detailCategories.find((c) => c.id === categoryId);
						if (category) {
							const selectedLabels = category.options
								.filter((opt) => ids.includes(opt.id))
								.map((opt) => opt.label);
							if (selectedLabels.length > 0) {
								label = selectedLabels.join(', ');
								active = true;
							}
						}
					}
					break;
				case 9:
					if (mealTimeState !== null) {
						const selectedOption = mealOptions.find(
							(opt) => opt.value === Number(mealTimeState),
						);
						if (selectedOption) {
							label = selectedOption.label;
							active = true;
						}
					}

					break;
			}
			return { ...item, label, active };
		});
		setDisplayItems(updatedItems);
	}, [
		distance,
		maxPrice,
		menu,
		minPrice,
		rating,
		mealTime,
		searchParams,
		mealTimeState,
	]);
	const pathname = usePathname();

	const handleFilterChange = (newFilter: number | null) => {
		onChange(newFilter);
		const params = new URLSearchParams(searchParams.toString());
		if (pathname === '/' || pathname === '/home') {
			params.set('from', 'home');
		} else if (pathname.startsWith('/search')) {
			params.set('from', 'search');
		} else {
			params.set('from', searchParams.get('from') ?? '');
		}

		if (newFilter !== null) {
			params.set('filter', newFilter.toString());
			params.set('focus', newFilter.toString());
			detailCategories.forEach((category) => {
				const raw = searchParams.get(category.id);
				if (raw) {
					params.set(category.id, raw); // food=1,2 이런식
				}
			});
			params.set('sort', sortOption);
			router.push(`/searchDetection?${params.toString()}`);
		} else {
			params.delete('filter');
		}
	};
	useEffect(() => {
		const tags: string[] = [];
		if (distance) tags.push(`${distance}m 이내`);
		if (rating) tags.push(`${Number(rating)}점 이상`);
		if (menu) tags.push(menu);
		if (minPrice && maxPrice) {
			tags.push(`${minPrice} ~ ${maxPrice}만원`);
		}
		detailCategories.forEach((category) => {
			const raw = searchParams.get(category.id); // 예: '1,3'
			if (raw) {
				const ids = raw.split(',').map(Number);
				const selectedLabels = category.options
					.filter((opt) => ids.includes(opt.id))
					.map((opt) => opt.label);
				tags.push(...selectedLabels);
			}
		});
		console.log('mealTimeState', mealTimeState);
		if (mealTimeState) {
			const selectedOption = mealOptions.find(
				(opt) => opt.value === Number(mealTimeState),
			);
			if (selectedOption) tags.push(selectedOption.label);
		}

		setFilterTags(tags);
	}, [
		distance,
		maxPrice,
		menu,
		minPrice,
		rating,
		searchParams,
		mealTime,
		mealTimeState,
	]);

	return (
		<div className="relative flex items-center cursor-pointer">
			{/* 왼쪽 정렬 버튼 */}
			<div className="shrink-0 mr-2">
				<SortDropdown
					value={sortOption}
					onChange={handleSortSelect}
					locationAvailable={locationAllowedBrowser && canUseDistanceSort}
				/>
			</div>

			{/* 카테고리 선택 */}
			<SingleCategorySelect
				value={value}
				onChange={handleFilterChange}
				className="flex-nowrap overflow-x-auto scrollbar-hide pr-10 cursor-pointer"
			>
				{displayItems.map((item) => (
					<SingleCategorySelect.Item
						key={item.value}
						value={item.value}
						className={clsx(
							'shrink-0 px-3 py-1 rounded-full',
							item.active
								? 'bg-grey-90 text-white'
								: 'border-grey-30 text-grey-60',
						)}
					>
						<div className="flex items-center gap-1">{item.label}</div>
					</SingleCategorySelect.Item>
				))}
			</SingleCategorySelect>

			{/* 오른쪽 고정 필터 아이콘 */}
			<div className="absolute right-0 z-50 cursor-pointer pointer-events-none">
				<div
					className=" flex items-center justify-center cursor-pointer"
					style={{
						background:
							'linear-gradient(to left, #FFFFFF 60%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0) 0%)',
						paddingLeft: '15px',

						paddingTop: '10px',
						paddingBottom: '10px',
					}}
				>
					<Icon
						name="Filter"
						className="text-grey-70 cursor-pointer"
						size="s"
						onClick={onClick}
					/>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;




/*
> git -c user.useConfigOnly=true commit --quiet --allow-empty-message --file -

husky - DEPRECATED



Please remove the following two lines from .husky/pre-commit:



#!/usr/bin/env sh

. "$(dirname -- "$0")/_/husky.sh"



They WILL FAIL in v10.0.0



🔍 Type checking...

🧹 Lint checking...



./src/features/home/components/FilterBar.tsx

108:5  Warning: React Hook useEffect has an unnecessary dependency: 'isInJeju'. Either exclude it or remove the dependency array. Outer scope values like 'isInJeju' aren't valid dependencies because mutating them doesn't re-render the component.  react-hooks/exhaustive-deps



./src/features/home/components/GoodStoreClient.tsx

24:9  Error: 'allStores' is assigned a value but never used.  @typescript-eslint/no-unused-vars

24:20  Error: 'setAllStores' is assigned a value but never used.  @typescript-eslint/no-unused-vars

35:8  Error: 'handleFilterSelect' is assigned a value but never used.  @typescript-eslint/no-unused-vars



./src/features/home/components/HomeContainer.tsx

104:7  Error: 'formatDistance' is assigned a value but never used.  @typescript-eslint/no-unused-vars

113:7  Error: 'extractMenus' is assigned a value but never used.  @typescript-eslint/no-unused-vars



./src/features/home/components/homeStore.tsx

71:10  Error: 'loading' is assigned a value but never used.  @typescript-eslint/no-unused-vars

125:6  Warning: React Hook useEffect has a missing dependency: 'fetchStores'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps



./src/features/home/lib/fetchGoodPrice.tsx

3:10  Error: 'logImages' is defined but never used.  @typescript-eslint/no-unused-vars



./src/features/menuPrice/components/Graph.tsx

389:6  Warning: React Hook useEffect has a missing dependency: 'userPos'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

생각 중
ChatGPT는 실수를 할 수 있습니다.
*/