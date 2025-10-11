import { useEffect, useState } from 'react';

import { getMenusByRestaurantId } from '@/entities/menu/api/api';

import { createAuthApi } from '@/shared/api';
import { StoreId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createStoreApi } from '../api/storeApi';
import { Store } from '../api/storeSchema';

const storeApi = createStoreApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

export const useStore = (storeId: StoreId) => {
	const [store, setStore] = useState<Store | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!storeId) {
			setIsLoading(false);
			return;
		}

		const fetchStoreData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const [storeData, menuData] = await Promise.all([
					storeApi.getStoreById(storeId),
					getMenusByRestaurantId(Number(storeId)),
				]);

				const mainMenuString =
					menuData.length > 0
						? menuData.map((menu) => menu.menuName).join(', ')
						: '대표 메뉴 정보 없음';

				setStore({ ...storeData, mainMenu: mainMenuString });
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to fetch store data',
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStoreData();
	}, [storeId]);

	return { store, isLoading, error };
};
