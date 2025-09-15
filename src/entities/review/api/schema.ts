/**
 * @file 가게 리뷰 조회 API의 Zod 스키마를 정의합니다.
 * @description 서버 응답의 유효성을 검증하고, mappers.ts의 변환 함수를 통해 클라이언트 모델로 변환하는 책임을 가집니다.
 */
import { z } from 'zod';

import { TooltipCategory } from '../model/tooltip';

// 툴팁 스키마
export const TooltipServerSchema = z.object({
	id: z.number(),
	type: z.enum(['FOOD', 'CLEAN', 'SERVICE']),
	rating: z.number(),
	detailedReview: z.string(),
	totalPrice: z.number().nullish(),
	menuName: z.string().nullish(),
	servingSize: z.number().nullish(),
});

// 리뷰 이미지 스키마
const ReviewImageServerSchema = z.object({
	imageId: z.string(),
	imageOrder: z.number(),
	imageUrl: z.string(),
	isMain: z.boolean(),
	tooltips: z.array(TooltipServerSchema),
});

// 리뷰 사용자 스키마 (nullable 프로필 이미지)
const ReviewUserServerSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	reviewCount: z.number(),
	averageRating: z.number(),
	profileImageUrl: z.string().nullish(),
});

// 리뷰 전체 스키마
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

// 페이지 스키마
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
export type ReviewServer = z.infer<typeof ReviewServerSchema>;

// 리뷰 클라이언트 스키마: 프로필 이미지 기본값 설정
export const ReviewClientSchema = ReviewServerSchema.transform(
	(serverData) => ({
		...serverData,
		author: {
			...serverData.author,
			profileImageUrl:
				serverData.author.profileImageUrl ?? '/images/avatar_default.png',
		},
		images: serverData.images.map((image) => ({
			...image,
			tooltips: image.tooltips.map((tooltip) => ({
				...tooltip,
				type: tooltip.type.toLowerCase() as TooltipCategory,
			})),
		})),
	}),
);

export type ReviewClient = z.infer<typeof ReviewClientSchema>;
