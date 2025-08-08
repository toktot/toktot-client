'use client';

import { useEffect, useState } from 'react';

import { CategoryItem } from '@/features/home/components/FoodIcon';

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
				console.log('Decoded token', token);
				const res = await fetch('https://api.toktot.site/v1/local-foods', {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'applicatin/json',
					},
					credentials: 'include',
				});

				console.log('Response status:', res.status);
				if (!res.ok) throw new Error('Failed to fetch categories');
				const data: { success: boolean; data: FoodCategoryItem[] } =
					await res.json();
				const mapped: CategoryItem[] = data.data.map((item) => ({
					id: item.id,
					name: item.name,
					icon: foodIconMap[item.icon_name] || 'None',
				}));
				console.log(data);
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
