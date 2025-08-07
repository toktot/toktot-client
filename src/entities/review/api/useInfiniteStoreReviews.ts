'use client';

import { useEffect, useState } from 'react';

import { ReviewView, TooltipCategory } from '@/entities/review';

import {
	mockReview1,
	mockReview2,
} from '@/widgets/review/read/ui/ReviewStoryFeed';

// Mock 데이터 임시 import
import { StoreId } from '@/shared/model/types';

// 실제 API 호출을 흉내 냅니다.
const fetchStoreReviewsAPI = async (
	storeId: StoreId,
	category: TooltipCategory,
	page: number,
): Promise<ReviewView[]> => {
	console.log(
		`API CALLED: GET /api/stores/${storeId}/reviews?category=${category}&page=${page}`,
	);
	await new Promise((resolve) => setTimeout(resolve, 500));

	// 카테고리에 따라 다른 목 데이터를 반환하는 로직 (예시)
	if (category === 'food' && page === 0) return [mockReview2];
	if (category === 'service' && page === 0) return [mockReview1];
	return []; // 데이터가 더 없으면 빈 배열 반환
};

export const useInfiniteStoreReviews = (
	storeId: StoreId,
	category: TooltipCategory,
) => {
	const [reviews, setReviews] = useState<ReviewView[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);

	useEffect(() => {
		// 카테고리가 변경되면 리뷰 목록을 초기화하고 다시 로드합니다.
		const loadInitialReviews = async () => {
			setIsLoading(true);
			setReviews([]);
			setPage(0);
			const initialReviews = await fetchStoreReviewsAPI(storeId, category, 0);
			setReviews(initialReviews);
			setHasNextPage(initialReviews.length > 0);
			setPage(1);
			setIsLoading(false);
		};
		if (storeId) {
			loadInitialReviews();
		}
	}, [storeId, category]);

	const fetchNextPage = async () => {
		if (isLoading || !hasNextPage) return;

		setIsLoading(true);
		const nextReviews = await fetchStoreReviewsAPI(storeId, category, page);
		setReviews((prev) => [...prev, ...nextReviews]);
		setHasNextPage(nextReviews.length > 0);
		setPage((prev) => prev + 1);
		setIsLoading(false);
	};

	return { data: reviews, isLoading, hasNextPage, fetchNextPage };
};
