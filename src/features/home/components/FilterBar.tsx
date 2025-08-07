'use client';

import { useEffect, useMemo, useState } from 'react';

import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { PLACE_MOOD_KEYWORDS } from '@/entities/store';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';
import SingleCategorySelect from '@/shared/ui/SingleCategorySelect';

export type FilterKey = 'distance' | 'rating' | 'goodstore' | 'openrun';

const filterItems: { label: string; value: number }[] = [
	{ label: '거리', value: 0 },
	{ label: '별점', value: 1 },
	{ label: '향토음식', value: 2 },
	{ label: '가격', value: 3 },
	{ label: '분위기', value: 4 },
	{ label: '시간', value: 5 },
] as const;

interface Props {
	value: number | null;
	onChange: (val: number | null) => void;
	onSummaryChange?: (summary: string) => void;
}

const FilterBar: React.FC<Props> = ({ value, onChange }) => {
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
	const mood = useMemo(() => {
		const raw = searchParams.get('mood');
		return raw ? raw.split(',').map(Number) : [];
	}, [searchParams]);
	console.log(filterTags);

	useEffect(() => {
		const updatedItems = filterItems.map((item) => {
			let label = item.label;
			switch (item.value) {
				case 0:
					if (distance) label = `${distance}m 이내`;
					setIsQueryActive(true);
					break;
				case 1:
					if (rating) label = `${rating}점 이상`;
					setIsQueryActive(true);
					break;
				case 2:
					if (menu) label = `${menu}`;
					setIsQueryActive(true);
					break;
				case 3:
					if (minPrice && maxPrice) {
						label = `${minPrice} ~ ${maxPrice} 만원`;
					}
					setIsQueryActive(true);
					break;
				case 4:
					if (mood.length) {
						const moods = PLACE_MOOD_KEYWORDS.filter((k) =>
							mood.includes(k.id),
						).map((k) => k.label);
						label = moods.join(',');
					}
					setIsQueryActive(true);
					break;
				case 5:
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
			return { ...item, label };
		});
		setDisplayItems(updatedItems);
	}, [distance, maxPrice, menu, minPrice, mood, rating, mealTime]);

	const handleIconClick = () => {
		router.push('/searchDetection');
	};

	const handleFilterChange = (newFilter: number | null) => {
		onChange(newFilter);
		const params = new URLSearchParams(searchParams.toString());
		if (newFilter !== null) params.set('filter', newFilter.toString());
		else params.delete('filter');
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
		if (mood.length) {
			const moods = PLACE_MOOD_KEYWORDS.filter((k) => mood.includes(k.id)).map(
				(k) => k.label,
			);
			tags.push(...moods);
		}

		setFilterTags(tags);
	}, [distance, maxPrice, menu, minPrice, mood, rating, searchParams]);

	return (
		<div className="flex items-center gap-2">
			<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
				<Icon
					name={'Filter'}
					className="text-gray-600 w-4 h-4"
					onClick={handleIconClick}
				/>
			</div>

			<SingleCategorySelect
				value={value}
				onChange={handleFilterChange}
				className="flex-wrap"
			>
				{displayItems.map((item) => (
					<SingleCategorySelect.Item
						key={item.value}
						value={item.value}
						className={clsx(
							isQueryActive
								? 'bg-grey-90 text-white'
								: 'text-grey-50 text-grey-70',
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
