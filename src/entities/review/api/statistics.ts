import type { KyInstance } from 'ky';

import { ApiResponseSchema } from '@/shared/api/schema';
import { StoreId } from '@/shared/model/types';

import { ReviewStatisticsServerSchema } from './statisticsSchema';

export const createReviewStatisticsApi = (kyInstance: KyInstance) => ({
	/**
	 * 특정 가게의 리뷰 통계를 가져옵니다.
	 */
	async getReviewStatistics(restaurantId: StoreId) {
		const raw = await kyInstance
			.get(`v1/restaurants/${restaurantId}/review-statistics`)
			.json();

		const parsed = ApiResponseSchema(ReviewStatisticsServerSchema).safeParse(
			raw,
		);

		if (!parsed.success) {
			console.error(
				'getReviewStatistics: API 응답 스키마 불일치',
				parsed.error.format(),
			);
			throw new Error('서버 응답 형식이 올바르지 않습니다.');
		}

		if (!parsed.data.success) {
			throw new Error(parsed.data.message ?? '리뷰 통계 조회 실패');
		}

		return parsed.data.data;
	},
});
