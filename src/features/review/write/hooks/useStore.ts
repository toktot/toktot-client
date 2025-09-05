import { useEffect, useState } from 'react';

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
				const data = await storeApi.getStoreById(storeId);
				setStore(data);
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
