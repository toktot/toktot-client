'use client';

import { useCallback, useState } from 'react';

import { getUserReviews } from '../api/api';
import { MyReview } from '../api/schema';

export const useInfiniteUserReviews = (userId: number) => {
	const [reviews, setReviews] = useState<MyReview[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [initialized, setInitialized] = useState(false);

	const loadMoreReviews = useCallback(async () => {
		if (isLoading || !hasMore) return;
		setIsLoading(true);
		setError(null);

		try {
			const data = await getUserReviews(userId, page);
			setReviews((prev) => {
				const existingIds = new Set(prev.map((r) => r.id));
				const newReviews = data.content.filter((r) => !existingIds.has(r.id));
				return [...prev, ...newReviews];
			});
			setHasMore(!data.last);
			setPage((prev) => prev + 1);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An unknown error occurred',
			);
		} finally {
			setIsLoading(false);
			setInitialized(true);
		}
	}, [isLoading, hasMore, page, userId]);

	return { reviews, isLoading, hasMore, error, loadMoreReviews, initialized };
};
