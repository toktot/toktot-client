// src/features/review/write/api/api.ts
import type { KyInstance } from 'ky';
import { z } from 'zod';

import { ApiError } from '@/shared/api/ApiError';
import { ApiResponseSchema } from '@/shared/api/schema';

import {
	ImageDeleteResponseSchema,
	ImageSessionClearDataSchema,
	ImageSessionResponseSchema,
	ImageUploadData,
	ImageUploadResponseSchema,
	ReviewSubmitData,
	ReviewSubmitPayloadSchema,
	ReviewSubmitResponseSchema,
	SessionData,
} from './schema';

export const createWriteReviewApi = (kyInstance: KyInstance) => ({
	/**
	 * 이미지 업로드 (multipart/form-data)
	 */
	async uploadImages(formData: FormData): Promise<ImageUploadData> {
		const raw = await kyInstance
			.post('v1/reviews/images', {
				body: formData,
			})
			.json();

		const parsed = ApiResponseSchema(ImageUploadResponseSchema).safeParse(raw);

		if (!parsed.success)
			throw new ApiError(
				'이미지 업로드 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		if (!parsed.data.success)
			throw new ApiError(
				parsed.data.message ?? '이미지 업로드에 실패했습니다.',
				parsed.data.errorCode,
			);
		if (!parsed.data.data)
			throw new ApiError('업로드 후 이미지 데이터가 비어있습니다.', 'NO_DATA');

		return parsed.data.data;
	},

	/**
	 * 이미지 삭제
	 */
	async deleteImage(
		imageId: string,
		restaurantId: number,
	): Promise<SessionData> {
		const raw = await kyInstance
			.delete(`v1/reviews/images/${imageId}`, {
				searchParams: { restaurant_id: restaurantId },
			})
			.json();
		const parsed = ApiResponseSchema(ImageDeleteResponseSchema).safeParse(raw);

		if (!parsed.success)
			throw new ApiError(
				'이미지 삭제 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		if (!parsed.data.success)
			throw new ApiError(
				parsed.data.message ?? '이미지 삭제에 실패했습니다.',
				parsed.data.errorCode,
			);
		if (!parsed.data.data)
			throw new ApiError('삭제 후 세션 데이터가 비어있습니다.', 'NO_DATA');

		return parsed.data.data;
	},

	/**
	 * 이미지 세션 조회
	 */
	async getImageSession(restaurantId: number): Promise<SessionData> {
		const raw = await kyInstance
			.get('v1/reviews/images', {
				searchParams: { restaurant_id: restaurantId },
			})
			.json();
		const parsed = ApiResponseSchema(ImageSessionResponseSchema).safeParse(raw);

		if (!parsed.success)
			throw new ApiError(
				'이미지 세션 조회 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		if (!parsed.data.success)
			throw new ApiError(
				parsed.data.message ?? '이미지 세션 조회에 실패했습니다.',
				parsed.data.errorCode,
			);
		if (!parsed.data.data)
			throw new ApiError('세션 데이터가 비어있습니다.', 'NO_DATA');

		return parsed.data.data;
	},

	/**
	 * 이미지 세션 초기화 (새로 쓰기)
	 */
	async clearImageSession(
		restaurantId: number,
	): Promise<{ success: true; data: 'cleared' }> {
		const raw = await kyInstance
			.delete('v1/reviews/images', {
				searchParams: { restaurant_id: restaurantId },
			})
			.json();
		const parsed = ApiResponseSchema(ImageSessionClearDataSchema).safeParse(
			raw,
		);

		if (!parsed.success) {
			throw new ApiError(
				'이미지 세션 초기화 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		}
		if (!parsed.data.success) {
			throw new ApiError(
				parsed.data.message ?? '이미지 세션 초기화에 실패했습니다.',
				parsed.data.errorCode ?? 'UNKNOWN_ERROR',
			);
		}
		return { success: true, data: 'cleared' as const };
	},

	/**
	 * 최종 리뷰 제출
	 */
	async submitReview(
		payload: z.infer<typeof ReviewSubmitPayloadSchema>,
	): Promise<ReviewSubmitData> {
		const validated = ReviewSubmitPayloadSchema.parse(payload);
		const raw = await kyInstance.post('v1/reviews', { json: validated }).json();
		const parsed = ApiResponseSchema(ReviewSubmitResponseSchema).safeParse(raw);

		if (!parsed.success)
			throw new ApiError(
				'리뷰 제출 응답 형식이 올바르지 않습니다.',
				'CLIENT_SCHEMA_ERROR',
			);
		if (!parsed.data.success)
			throw new ApiError(
				parsed.data.message ?? '리뷰 제출에 실패했습니다.',
				parsed.data.errorCode,
			);
		if (!parsed.data.data)
			throw new ApiError('리뷰 제출 후 데이터가 비어있습니다.', 'NO_DATA');

		return parsed.data.data;
	},
});
