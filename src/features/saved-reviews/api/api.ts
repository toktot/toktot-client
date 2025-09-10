'use client';

import { createAuthApi } from '@/shared/api';
import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';
import { getDecryptedToken } from '@/shared/utils/storage';

import { SavedReviewsPage, SavedReviewsPageSchema } from './schema';

const api = createAuthApi({
	getToken: () => getDecryptedToken() ?? undefined,
});

export const getSavedReviewsInFolder = async (
	folderId: number,
	page: number,
	size = 20,
): Promise<SavedReviewsPage> => {
	const raw = await api
		.get(`v1/folders/reviews/${folderId}`,
		{
			searchParams: {
				page,
				size,
			},
		})
		.json();

	const parsed = ApiResponseSchema(SavedReviewsPageSchema).safeParse(raw);

	if (!parsed.success) {
		console.error(
			'getSavedReviewsInFolder: API 응답 스키마 불일치',
			parsed.error.format(),
		);
		throw new ApiError('서버 응답 형식이 올바르지 않습니다.');
	}

	if (!parsed.data.success) {
		throw new ApiError(
			parsed.data.message ?? '저장된 리뷰 목록 조회에 실패했습니다.',
			parsed.data.errorCode,
		);
	}

	if (!parsed.data.data) {
		throw new ApiError('API 응답에 데이터가 없습니다.', 'NO_DATA');
	}

	return parsed.data.data;
};
