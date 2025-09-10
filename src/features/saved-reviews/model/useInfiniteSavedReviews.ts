'use client';

import { useCallback, useState } from 'react';

import { getSavedReviewsInFolder } from '../api/api';
import { SavedReview } from '../api/schema';

export const useInfiniteSavedReviews = (folderId: number) => {
	const [reviews, setReviews] = useState<SavedReview[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadMoreReviews = useCallback(async () => {
		if (isLoading || !hasMore) return;

		setIsLoading(true);
		setError(null);

		try {
			const data = await getSavedReviewsInFolder(folderId, page);
			setReviews((prev) => {
				const existingIds = new Set(prev.map((r) => r.id));
				const newReviews = data.content.filter((r) => !existingIds.has(r.id));
				return [...prev, ...newReviews];
			});
			setHasMore(!data.last);
			setPage((prev) => prev + 1);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unknown error occurred');
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, hasMore, page, folderId]);

	return { reviews, isLoading, hasMore, error, loadMoreReviews };
};
