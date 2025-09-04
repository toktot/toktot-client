import { z } from 'zod';

/**
 * @file 리뷰 통계 조회 API 스키마 정의
 */

// 만족도 분포
const SatisfactionDistributionSchema = z.object({
	highRange: z.number(),
	midRange: z.number(),
	lowRange: z.number(),
});

// 툴팁별 평점
const TooltipRatingsSchema = z.object({
	foodRating: z.number(),
	cleanRating: z.number(),
	serviceRating: z.number(),
});

// 서버 응답 data
export const ReviewStatisticsServerSchema = z.object({
	totalReviewCount: z.number(),
	overallRating: z.number(),
	tooltipRatings: TooltipRatingsSchema,
	satisfactionDistribution: SatisfactionDistributionSchema,
});

// 최종 API 응답 스키마 (success 래핑 포함)
export const ReviewStatisticsApiResponseSchema = z.object({
	success: z.boolean(),
	data: ReviewStatisticsServerSchema,
});

// 타입 추론
export type ReviewStatisticsServer = z.infer<
	typeof ReviewStatisticsServerSchema
>;
