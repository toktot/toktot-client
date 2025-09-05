'use client';

import { useEffect, useMemo, useState } from 'react';

import { createAuthApi } from '@/shared/api';
import { StoreId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createReviewApi } from './review';
import { ReviewServer } from './schema';

export const useInfiniteStoreReviews = (storeId: StoreId) => {
	const [reviews, setReviews] = useState<ReviewServer[]>([]);
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);

	// 의도: API 클라이언트는 한 번만 생성되어야 하므로 useMemo를 사용합니다.
	const api = useMemo(() => {
		const getToken = () => getDecryptedToken() ?? undefined;
		const authKy = createAuthApi({ getToken });
		return createReviewApi(authKy);
	}, []);

	// 의도: storeId가 바뀔 때마다, 리뷰 목록을 초기화하고 첫 페이지부터 다시 로드합니다.
	useEffect(() => {
		if (!storeId) return;

		const loadInitialReviews = async () => {
			setIsLoading(true);
			setReviews([]);
			setPage(0);
			try {
				const { reviews: initialReviews, isLastPage } =
					await api.getStoreReviews(storeId, 0, 10);
				setReviews(initialReviews);
				setHasNextPage(!isLastPage);
				setPage(1);
			} catch (error) {
				console.error(error);
				setHasNextPage(false); // 에러 발생 시 더 이상 로드하지 않음
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialReviews();
	}, [storeId, api]);

	const fetchNextPage = async () => {
		if (isLoading || !hasNextPage) return;

		setIsLoading(true);
		try {
			const { reviews: nextReviews, isLastPage } = await api.getStoreReviews(
				storeId,
				page,
				10,
			);
			setReviews((prev) => [...prev, ...nextReviews]);
			setHasNextPage(!isLastPage);
			setPage((prev) => prev + 1);
		} catch (error) {
			console.error(error);
			setHasNextPage(false);
		} finally {
			setIsLoading(false);
		}
	};

	return { data: reviews, isLoading, hasNextPage, fetchNextPage };
};
