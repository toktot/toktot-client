/**
 * 서버 API에서 사용하는 신고 유형 Enum
 */
export type UserReportType =
	| 'SPAM_PROMOTIONAL'
	| 'INAPPROPRIATE_CONTENT'
	| 'DEFAMATION_COPYRIGHT'
	| 'OTHER';

// --- 리뷰 신고 ---
export type ReviewReportApiType =
	| 'MALICIOUS_POST'
	| 'PROMOTIONAL_POST'
	| 'INAPPROPRIATE_CONTENT'
	| 'DEFAMATION_COPYRIGHT'
	| 'WRONG_RESTAURANT'
	| 'PRIVACY_VIOLATION'
	| 'OTHER';
