'use client';

import { useMemo } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { useRouter, useSearchParams } from 'next/navigation';

const BASE_FILTERS = [
	{ id: 'distance', label: '거리' },
	{ id: 'rating', label: '별점' },
	{ id: 'menu', label: '향토음식' },
	{ id: 'price', label: '가격' },
	{ id: 'food', label: '음식' },
	{ id: 'service', label: '서비스' },
	{ id: 'clean', label: '청결' },
	{ id: 'mood', label: '분위기' },
	{ id: 'parking', label: '주차공간' },
	{ id: 'meal', label: '시간' },
];

export const useReviewFeedFilterController = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const activeFilters = useMemo(() => {
		return BASE_FILTERS.map((filter) => {
			let newLabel = filter.label;
			let isActive = false;

			const paramValue = searchParams.get(filter.id);
			if (paramValue) {
				isActive = true;
				switch (filter.id) {
					case 'rating':
						newLabel = `${paramValue}점 이상`;
						break;
					case 'distance':
						newLabel = `${paramValue}m 이내`;
						break;
					case 'menu':
						newLabel = `${paramValue}`;
						break;
					case 'price':
					case 'food':
					case 'service':
					case 'clean':
					case 'mood':
					case 'parking':
					case 'meal': {
						const category = detailCategories.find((c) => c.id === filter.id);
						if (category) {
							const ids = paramValue.split(',').map(Number);
							const selected = category.options
								.filter((opt) => ids.includes(opt.id))
								.map((opt) => opt.label);
							if (selected.length > 0) {
								newLabel = selected.join(', ');
							}
						}
						break;
					}
				}
			}

			return { ...filter, label: newLabel, active: isActive };
		});
	}, [searchParams]);

	const handleFilterClick = (filterId: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('from', 'review_feed');
		const focusId = BASE_FILTERS.findIndex((f) => f.id === filterId);
		if (focusId !== -1) {
			params.set('focus', String(focusId));
		}
		router.push(`/searchDetection?${params.toString()}`);
	};

	return { activeFilters, handleFilterClick };
};
