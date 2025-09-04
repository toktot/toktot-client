/**
 * @file 리뷰 관련 API를 호출하는 함수들을 정의합니다.
 * @description ky 인스턴스를 받아, 각 엔드포인트에 대한 요청/응답 처리 및 Zod 검증을 수행합니다.
 */
import type { KyInstance } from 'ky';

import { ApiResponseSchema } from '@/shared/api/schema';
import { StoreId } from '@/shared/model/types';

import { ReviewServer, StoreReviewsPageServerSchema } from './schema';

export interface GetStoreReviewsResponse {
	reviews: ReviewServer[];
	isLastPage: boolean;
}

export const createReviewApi = (kyInstance: KyInstance) => ({
	/**
	 * 특정 가게의 리뷰 목록을 페이지네이션하여 가져옵니다.
	 */
	async getStoreReviews(
		restaurantId: StoreId,
		page: number = 0,
		size: number = 10,
		sort: string = 'createdAt',
	): Promise<GetStoreReviewsResponse> {
		const raw = await kyInstance
			.get(`v1/restaurants/${restaurantId}/reviews`, {
				searchParams: {
					page,
					size,
					sortType: sort, // desc
				},
			})
			.json();

		const parsedApiResponse = ApiResponseSchema(
			StoreReviewsPageServerSchema,
		).safeParse(raw);

		if (!parsedApiResponse.success) {
			console.error(
				'getStoreReviews: API 응답 스키마 불일치',
				parsedApiResponse.error.format(),
			);
			throw new Error('서버 응답 형식이 올바르지 않습니다.');
		}

		if (!parsedApiResponse.data.success) {
			throw new Error(
				parsedApiResponse.data.message ?? '가게 리뷰 목록 조회 실패',
			);
		}

		const pageData = parsedApiResponse.data.data;
		if (!pageData) {
			throw new Error('응답에 데이터가 없습니다.');
		}

		return {
			reviews: pageData.content,
			isLastPage: pageData.last,
		};
	},
});
