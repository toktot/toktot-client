'use client';

import { useEffect, useState } from 'react';

import { getMenusByRestaurantId } from '../api/api';
import { Menu } from '../api/schema';

export const useMenusByRestaurant = (restaurantId: number) => {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!restaurantId) {
			setIsLoading(false);
			return;
		}

		const fetchMenus = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const menuData = await getMenusByRestaurantId(restaurantId);
				setMenus(menuData);
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: '메뉴 조회 중 오류가 발생했습니다.';
				setError(errorMessage);
				console.error(`[ID: ${restaurantId}] 메뉴 조회 실패:`, err);
				setMenus([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMenus();
	}, [restaurantId]);

	return { menus, isLoading, error };
};
