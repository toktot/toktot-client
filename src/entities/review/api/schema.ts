/**
 * @file 가게 리뷰 조회 API의 Zod 스키마를 정의합니다.
 * @description 서버 응답의 유효성을 검증하고, mappers.ts의 변환 함수를 통해 클라이언트 모델로 변환하는 책임을 가집니다.
 */
import { z } from 'zod';

import { mapServerReviewToClientView } from './mappers';

// 서버 응답의 가장 깊은 레벨부터 스키마를 정의합니다.
const ReviewMenuServerSchema = z.object({
	menuName: z.string(),
	totalPrice: z.number(),
});

const ReviewImageServerSchema = z.object({
	id: z.number(),
	imageUrl: z.string(),
	menus: z.array(ReviewMenuServerSchema),
});

const ReviewUserServerSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	profileImageUrl: z.string().nullable(),
	reviewCount: z.number(),
	averageRating: z.number(),
});

// 개별 리뷰에 대한 서버 스키마
const ReviewServerSchema = z.object({
	id: z.number(),
	user: ReviewUserServerSchema,
	images: z.array(ReviewImageServerSchema),
	keywords: z.array(z.string()),
	createdAt: z.string(),
	isWriter: z.boolean(),
});

// 페이지네이션 응답 전체에 대한 서버 스키마
export const StoreReviewsPageServerSchema = z.object({
	content: z.array(ReviewServerSchema),
	last: z.boolean(),
	// ... 기타 페이지네이션 필드들
});

// 서버 스키마를 클라이언트에서 사용할 ReviewView 모델로 변환합니다.
export const ReviewClientSchema = ReviewServerSchema.transform(
	mapServerReviewToClientView,
);
