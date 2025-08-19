import { KeywordId } from '@/shared/model/types';

import { UserReportType } from '../model/types';

export type ReportReason = {
	id: KeywordId;
	label: string;
	apiValue: UserReportType;
};

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
export const REPORT_REASON_MAP = new Map(
	REPORT_REASONS.map((reason) => [reason.id, reason]),
);
