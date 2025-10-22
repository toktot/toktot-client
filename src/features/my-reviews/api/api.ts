'use client';

import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';
import { getDecryptedToken } from '@/shared/utils/storage';

import { MyReviewsPage, MyReviewsPageSchema } from './schema';

import { z } from 'zod';

const api = createAuthApi({
	getToken: () => getDecryptedToken() ?? undefined,
});

export const getMyReviews = async (page: number, size = 20): Promise<MyReviewsPage> => {
	const raw = await api
		.get('v1/reviews/my', {
			searchParams: {
				page,
				size,
			},
		})
		.json();

	const parsed = ApiResponseSchema(MyReviewsPageSchema).safeParse(raw);

	if (!parsed.success) {
		console.error('getMyReviews: API 응답 스키마 불일치', parsed.error.format());
		throw new ApiError('서버 응답 형식이 올바르지 않습니다.');
	}

	if (!parsed.data.success) {
		throw new ApiError(
			parsed.data.message ?? '내가 작성한 리뷰 목록 조회에 실패했습니다.',
			parsed.data.errorCode,
		);
	}

	if (!parsed.data.data) {
		throw new ApiError('API 응답에 데이터가 없습니다.', 'NO_DATA');
	}

	return parsed.data.data;
};

export const deleteMyReview = async (reviewId: number): Promise<void> => {
	const raw = await api.delete(`v1/reviews/${reviewId}`).json();

	const parsed = ApiResponseSchema(z.null()).safeParse(raw);

	if (!parsed.success) {
		throw new ApiError('리뷰 삭제 API 응답 형식이 올바르지 않습니다.');
	}

	if (!parsed.data.success) {
		throw new ApiError(
			parsed.data.message ?? '리뷰 삭제에 실패했습니다.',
			parsed.data.errorCode,
		);
	}
};

export const getUserReviews = async (
	userId: number,
	page: number,
	size = 20,
): Promise<MyReviewsPage> => {
	const raw = await api
		.get(`v1/reviews/users/${userId}`, {
			searchParams: {
				page,
				size,
			},
		})
		.json();

	const parsed = ApiResponseSchema(MyReviewsPageSchema).safeParse(raw);

	if (!parsed.success) {
		console.error('getUserReviews: API 응답 스키마 불일치', parsed.error.format());
		throw new ApiError('서버 응답 형식이 올바르지 않습니다.');
	}

	if (!parsed.data.success) {
		throw new ApiError(
			parsed.data.message ?? '사용자 리뷰 목록 조회에 실패했습니다.',
			parsed.data.errorCode,
		);
	}

	if (!parsed.data.data) {
		throw new ApiError('API 응답에 데이터가 없습니다.', 'NO_DATA');
	}

	return parsed.data.data;
};