import { KyInstance } from 'ky';

import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';

import {
	ReviewSearchRequest,
	ReviewSearchRequestSchema,
	ReviewSearchResponse,
	ReviewSearchResponseDataSchema,
} from './schema';

export const createReviewFeedApi = (ky: KyInstance) => ({
	/**
	 * 필터링 조건에 맞는 리뷰 피드를 검색합니다.
	 */
	async searchReviews(
		payload: ReviewSearchRequest,
		page: number = 0,
		size: number = 10,
	): Promise<ReviewSearchResponse> {
		const validatedPayload = ReviewSearchRequestSchema.parse(payload);

		const raw = await ky
			.post('v1/reviews/feed', {
				json: validatedPayload,
				searchParams: {
					page,
					size,
				},
			})
			.json();

		const parsed = ApiResponseSchema(ReviewSearchResponseDataSchema).safeParse(
			raw,
		);

		if (!parsed.success) {
			throw new ApiError(
				'리뷰 피드 검색 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}

		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '리뷰 피드 검색에 실패했습니다.',
				parsed.data.errorCode,
			);
		}

		if (!parsed.data.data) {
			throw new ApiError('검색 결과 데이터가 비어있습니다.', 'NO_DATA');
		}

		return parsed.data.data;
	},
});
