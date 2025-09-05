'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createReviewFeedApi } from '../api/reviewFeedApi';
import { ReviewContent, ReviewSearchRequest } from '../api/schema';

const api = createReviewFeedApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

export const useInfiniteReviewFeed = (filters: ReviewSearchRequest) => {
	const [reviews, setReviews] = useState<ReviewContent[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);

	// const loadReviews = useCallback(
	// 	async (isNewSearch: boolean) => {
	// 		if (isLoading || (!isNewSearch && !hasNextPage)) return;

	// 		setIsLoading(true);
	// 		const pageToFetch = isNewSearch ? 0 : page;

	// 		try {
	// 			const response = await api.searchReviews(filters, pageToFetch, 10);
	// 			debugger;
	// 			setReviews((prev) =>
	// 				isNewSearch ? response.content : [...prev, ...response.content],
	// 			);
	// 			setHasNextPage(!response.last);
	// 			setPage(pageToFetch + 1);
	// 		} catch (error) {
	// 			console.error(error);
	// 			setHasNextPage(false);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[filters, hasNextPage, isLoading, page], // Include filters in dependencies
	// );

	// Memoize filters to prevent unnecessary re-renders
	const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

	useEffect(() => {
		setReviews([]);
		setPage(0);
		setHasNextPage(true);

		// Use a separate async function to avoid dependency issues
		const initializeReviews = async () => {
			if (isLoading) return;

			setIsLoading(true);
			try {
				const response = await api.searchReviews(memoizedFilters, 0, 10);
				setReviews(response.content);
				setHasNextPage(!response.last);
				setPage(1);
			} catch (error) {
				console.error(error);
				setHasNextPage(false);
			} finally {
				setIsLoading(false);
			}
		};

		initializeReviews();
	}, [memoizedFilters]); // Only depend on memoized filters

	const fetchNextPage = useCallback(() => {
		if (isLoading || !hasNextPage) return;

		setIsLoading(true);

		const loadNextPage = async () => {
			try {
				const response = await api.searchReviews(memoizedFilters, page, 10);
				setReviews((prev) => [...prev, ...response.content]);
				setHasNextPage(!response.last);
				setPage((prev) => prev + 1);
			} catch (error) {
				console.error(error);
				setHasNextPage(false);
			} finally {
				setIsLoading(false);
			}
		};

		loadNextPage();
	}, [memoizedFilters, page, isLoading, hasNextPage]);

	return { data: reviews, isLoading, hasNextPage, fetchNextPage };
};
