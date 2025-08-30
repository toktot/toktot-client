'use client';

import { useEffect, useState } from 'react';

import { CategoryItem } from '@/features/home/components/FoodIcon';
import api from '@/features/home/lib/api';

import { foodIconMap } from '../icons/CategoryIconMap';
import { getDecryptedToken } from '../utils/storage';

interface FoodCategoryItem {
	id: number;
	name: string;
	icon_name: string;
}

export function useCategories() {
	const [categories, setCategories] = useState<CategoryItem[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchCategories() {
			try {
				if (typeof window === 'undefined') return;
				const token = getDecryptedToken(); // 여기 변경
				console.log(token);

				console.log('Decoded token', token);
				const res = await api.get<{
					success: boolean;
					data: FoodCategoryItem[];
				}>('/v1/local-foods');
				console.log(res);
				const mapped: CategoryItem[] = res.data.data.map((item) => ({
					id: item.id,
					name: item.name,
					icon: foodIconMap[item.icon_name] || 'None',
				}));

				setCategories(mapped);
			} catch (err: unknown) {
				if (err instanceof Error) setError(err.message);
				else setError('알 수 없는 에러');
			} finally {
				setLoading(false);
			}
		}
		fetchCategories();
	}, []);

	return { categories, loading, error };
}
