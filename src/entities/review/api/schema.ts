/**
 * @file 가게 리뷰 조회 API의 Zod 스키마를 정의합니다.
 * @description 서버 응답의 유효성을 검증하고, mappers.ts의 변환 함수를 통해 클라이언트 모델로 변환하는 책임을 가집니다.
 */
import { z } from 'zod';

export const TooltipServerSchema = z.object({
	id: z.number(),
	type: z.enum(['FOOD', 'CLEAN', 'SERVICE']), // enum으로 확장 가능
	rating: z.number(),
	menuName: z.string().nullable(),
	totalPrice: z.number().nullable(),
	servingSize: z.number().nullable(),
	detailedReview: z.string(),
});

const ReviewImageServerSchema = z.object({
	imageId: z.string(),
	imageOrder: z.number(),
	imageUrl: z.string(),
	isMain: z.boolean(),
	tooltips: z.array(TooltipServerSchema),
});

const ReviewUserServerSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	profileImageUrl: z.string().nullable(),
	reviewCount: z.number(),
	averageRating: z.number(),
});

const ReviewServerSchema = z.object({
	id: z.number(),
	author: ReviewUserServerSchema,
	images: z.array(ReviewImageServerSchema),
	keywords: z.array(z.string()),
	createdAt: z.string(),
	isBookmarked: z.boolean().optional(),
	isWriter: z.boolean(),
	satisfactionScore: z.number(),
	tooltips: z.array(TooltipServerSchema),
	mealTime: z.string(),
	reviewRating: z.number(),
});

export const StoreReviewsPageServerSchema = z.object({
	content: z.array(ReviewServerSchema),
	last: z.boolean(),
	totalElements: z.number(),
	totalPages: z.number(),
	size: z.number(),
	number: z.number(),
});

export type StoreReviewsPageServer = z.infer<
	typeof StoreReviewsPageServerSchema
>;

// 서버 스키마를 클라이언트에서 사용할 ReviewView 모델로 변환합니다.
// export const ReviewClientSchema = ReviewServerSchema.transform(
// 	mapServerReviewToClientView,
// );

export type ReviewServer = z.infer<typeof ReviewServerSchema>;
