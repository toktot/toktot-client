import { KeywordId } from '@/shared/model/types';

import { ReviewReportApiType, UserReportType } from '../model/types';

export type ReportReason = {
	id: KeywordId;
	label: string;
	apiValue: UserReportType;
};

// --- 사용자 신고 ---

/**
 * 신고 사유 목록
 */
export const REPORT_REASONS: readonly ReportReason[] = [
	{
		id: 801 as KeywordId,
		label: '신뢰하기 어려운 홍보성 게시글을 다수 올림',
		apiValue: 'SPAM_PROMOTIONAL',
	},
	{
		id: 802 as KeywordId,
		label: '음란성 또는 부적절한 게시글을 올림',
		apiValue: 'INAPPROPRIATE_CONTENT',
	},
	{
		id: 803 as KeywordId,
		label: '명예훼손 및 저작권 침해',
		apiValue: 'DEFAMATION_COPYRIGHT',
	},
	{ id: 804 as KeywordId, label: '그 외 기타', apiValue: 'OTHER' },
];

/**
 * ID를 키로 사용하여 신고 사유를 빠르게 찾기 위한 맵
 */
export const USER_REPORT_REASON_MAP = new Map(
	REPORT_REASONS.map((reason) => [reason.id, reason]),
);

// --- 사용자 신고 관련 타입 및 데이터 ---

export type ReporterType = 'CUSTOMER' | 'RESTAURANT_OWNER';

export type ReviewReportReason = {
	id: KeywordId;
	label: string;
	apiValue: ReviewReportApiType;
};

export const REVIEW_REPORT_REASONS: readonly ReviewReportReason[] = [
	{
		id: 901 as KeywordId,
		label: '근거 없이 악의적인 게시글',
		apiValue: 'MALICIOUS_POST',
	},
	{
		id: 902 as KeywordId,
		label: '신뢰하기 어려운 홍보성 게시글',
		apiValue: 'PROMOTIONAL_POST',
	},
	{
		id: 903 as KeywordId,
		label: '음란성 또는 부적절한 게시글',
		apiValue: 'INAPPROPRIATE_CONTENT',
	},
	{
		id: 904 as KeywordId,
		label: '명예훼손 및 저작권 침해',
		apiValue: 'DEFAMATION_COPYRIGHT',
	},
	{
		id: 905 as KeywordId,
		label: '다른 매장의 리뷰',
		apiValue: 'WRONG_RESTAURANT',
	},
	{
		id: 906 as KeywordId,
		label: '신뢰하기 어려운 홍보성 게시글',
		apiValue: 'PROMOTIONAL_POST',
	},
	{
		id: 907 as KeywordId,
		label: '초상권 침해 또는 개인정보 노출',
		apiValue: 'PRIVACY_VIOLATION',
	},
	{
		id: 908 as KeywordId,
		label: '그 외 기타',
		apiValue: 'OTHER',
	},
];

/**
 * ID를 키로 사용하여 리뷰 신고 사유를 빠르게 찾기 위한 맵
 */
export const REVIEW_REPORT_REASON_MAP = new Map(
	REVIEW_REPORT_REASONS.map((reason) => [reason.id, reason]),
);
