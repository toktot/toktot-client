'use client';

import { useEffect, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mealOptions } from '@/entities/home/model/mockMealOptions';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

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
}

const FilterBar: React.FC<Props> = ({ value, onChange, onClick }) => {
	const [filterTags, setFilterTags] = useState<string[]>([]);
	const router = useRouter();
	const searchParams = useSearchParams();

	const [displayItems, setDisplayItems] = useState(filterItems);
	const [isQueryActive, setIsQueryActive] = useState(false);
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
					if (menu) label = `${menu} `;

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
					if (mealTime !== undefined) {
						const selectedLabels = mealOptions
							.filter((k) =>
								Array.isArray(mealTime)
									? mealTime.includes(k.value)
									: Number(mealTime) === k.value,
							)
							.map((k) => k.label);
						label = selectedLabels.join(',');
					}
					setIsQueryActive(true);
					break;
			}
			return { ...item, label, active };
		});
		setDisplayItems(updatedItems);
	}, [distance, maxPrice, menu, minPrice, rating, mealTime, searchParams]);

	const handleFilterChange = (newFilter: number | null) => {
		onChange(newFilter);
		const params = new URLSearchParams(searchParams.toString());

		if (newFilter !== null) {
			params.set('filter', newFilter.toString());
			params.set('focus', newFilter.toString());
			detailCategories.forEach((category) => {
				const raw = searchParams.get(category.id);
				if (raw) {
					params.set(category.id, raw); // food=1,2 이런식
				}
			});

			router.push(
				`/searchDetection?focus=${newFilter}&rating=${rating}&distance=${distance ?? ''}&meal=${mealTime ?? ''}&maxPrice=${maxPrice}&minPrice=${minPrice}&menu=${menu}${params.toString()}`,
			);
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
			tags.push(
				`${searchParams.get('minPrice')} ~ ${searchParams.get('maxPrice')}만원`,
			);
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

		setFilterTags(tags);
	}, [distance, maxPrice, menu, minPrice, rating, searchParams]);

	return (
		<div className="flex items-center gap-2">
			<div className="min-w-[24px] h-[24px] rounded-full bg-grey-20 flex items-center justify-center">
				<Icon
					name={'Filter'}
					className="text-grey-70"
					size="xs"
					onClick={onClick}
				/>
			</div>

			<SingleCategorySelect
				value={value}
				onChange={handleFilterChange}
				className="flex-nowrap overflow-x-auto scrollbar-hide"
			>
				{displayItems.map((item) => (
					<SingleCategorySelect.Item
						key={item.value}
						value={item.value}
						className={clsx(
							'shrink-0 px-3 py-1 rounded-full',
							item.active
								? 'bg-grey-90 text-white'
								: 'text-grey-60 text-grey-30',
						)}
					>
						<div className="flex items-center gap-1">{item.label}</div>
					</SingleCategorySelect.Item>
				))}
			</SingleCategorySelect>
		</div>
	);
};

export default FilterBar;
