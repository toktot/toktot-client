import { UserReportType } from '@/entities/report/model/types';
import { z } from 'zod';

import {
	REPORT_DETAIL_ERROR_MESSAGE,
	REPORT_DETAIL_MAX_LENGTH,
} from '../config/constants';

// --- API 응답의 `data` 필드에 대한 스키마 ---

// GET /v1/report/users/{reportedUserId}/can-report 의 성공 응답 data는 null
export const CanReportDataSchema = z.null();

// POST /v1/report/users 의 성공 응답 data는 null
export const SubmitReportDataSchema = z.null();

// --- API 요청의 `body` 필드에 대한 스키마 ---

// 서버에서 사용하는 신고 유형 Enum
const userReportTypes: [UserReportType, ...UserReportType[]] = [
	'SPAM_PROMOTIONAL',
	'INAPPROPRIATE_CONTENT',
	'DEFAMATION_COPYRIGHT',
	'OTHER',
];

export const UserReportTypeSchema = z.enum(userReportTypes);

// POST /v1/report/users 의 요청 body 스키마
export const UserReportPayloadSchema = z.object({
	reported_user_id: z.number().positive(),
	report_types: z
		.array(UserReportTypeSchema)
		.min(1, '신고 사유를 선택해주세요.'),
	privacy_consent: z.literal(true, {
		errorMap: () => ({ message: '개인정보 수집에 동의해야 합니다.' }),
	}),
	other_reason: z
		.string()
		.max(REPORT_DETAIL_MAX_LENGTH, REPORT_DETAIL_ERROR_MESSAGE)
		.optional(),
});

export type UserReportPayload = z.infer<typeof UserReportPayloadSchema>;

// --- 리뷰 신고 관련 ---

// GET /v1/report/reviews/{reviewId}/can-report 의 성공 응답 data는 null
export const CanReportReviewDataSchema = z.null();

// POST /v1/report/reviews 의 성공 응답 data는 null
export const SubmitReviewReportDataSchema = z.null();

// 서버에서 사용하는 리뷰 신고 유형 Enum 스키마
export const ReviewReportTypeSchema = z.enum([
	'MALICIOUS_POST',
	'PROMOTIONAL_POST',
	'INAPPROPRIATE_CONTENT',
	'DEFAMATION_COPYRIGHT',
	'WRONG_RESTAURANT',
	'PRIVACY_VIOLATION',
	'OTHER',
]);

// 서버에서 사용하는 신고자 유형 Enum 스키마
export const ReporterTypeSchema = z.enum(['CUSTOMER', 'RESTAURANT_OWNER']);

// POST /v1/report/reviews 의 요청 body 스키마
export const ReviewReportPayloadSchema = z.object({
	review_id: z.number().positive(),
	reporter_type: ReporterTypeSchema,
	report_types: z
		.array(ReviewReportTypeSchema)
		.min(1, '신고 사유를 선택해주세요.'),
	privacy_consent: z.literal(true, {
		errorMap: () => ({ message: '개인정보 수집에 동의해야 합니다.' }),
	}),
	other_reason: z
		.string()
		.max(REPORT_DETAIL_MAX_LENGTH, REPORT_DETAIL_ERROR_MESSAGE)
		.optional(),
});

// 요청 body의 타입을 추론하여 export
export type ReviewReportPayload = z.infer<typeof ReviewReportPayloadSchema>;
