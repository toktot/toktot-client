'use client';

import { useEffect, useMemo, useState } from 'react';

import { createReviewStatisticsApi } from '@/entities/review/api/statistics';
import { ReviewStatisticsServer } from '@/entities/review/api/statisticsSchema';

import { createAuthApi } from '@/shared/api';
import { StoreId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

export const useReviewStatistics = (restaurantId: StoreId) => {
	const [statistics, setStatistics] = useState<ReviewStatisticsServer | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const api = useMemo(() => {
		return createReviewStatisticsApi(
			createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
		);
	}, []);

	useEffect(() => {
		if (!restaurantId) {
			setIsLoading(false);
			return;
		}

		const fetchStatistics = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await api.getReviewStatistics(restaurantId);
				setStatistics(data);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: '리뷰 통계를 불러오는 데 실패했습니다.',
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStatistics();
	}, [restaurantId, api]);

	return { data: statistics, isLoading, error };
};
