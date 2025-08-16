import { KeywordId } from '@/shared/model/types';

export type Keyword = { id: KeywordId; label: string };
export type KeywordCategory =
	| 'food'
	| 'cleanliness'
	| 'price'
	| 'service'
	| 'atmosphere'
	| 'accessibility';

// 각 카테고리별 키워드 데이터
export const FOOD_KEYWORDS: Keyword[] = [
	{ id: 101 as KeywordId, label: '신선해요' },
	{ id: 102 as KeywordId, label: '양이 많아요' },
	{ id: 103 as KeywordId, label: '가성비 좋아요' },
	{ id: 104 as KeywordId, label: '특이해요' },
	{ id: 105 as KeywordId, label: '정갈해요' },
	{ id: 106 as KeywordId, label: '맛있어요' },
];

export const CLEANLINESS_KEYWORDS: Keyword[] = [
	{ id: 201 as KeywordId, label: '매장이 청결해요' },
	{ id: 202 as KeywordId, label: '화장실이 깨끗해요' },
	{ id: 203 as KeywordId, label: '깨끗한 테이블' },
];

export const PRICE_KEYWORDS: Keyword[] = [
	{ id: 301 as KeywordId, label: '가격 미기재' },
	{ id: 302 as KeywordId, label: '바가지 없음' },
	{ id: 303 as KeywordId, label: '적당해요' },
	{ id: 304 as KeywordId, label: '가성비 좋음' },
	{ id: 305 as KeywordId, label: '합리적 소비' },
];

export const SERVICE_KEYWORDS: Keyword[] = [
	{ id: 401 as KeywordId, label: '응대가 빨라요' },
	{ id: 402 as KeywordId, label: '대기가 길어요' },
	{ id: 403 as KeywordId, label: '예약 필수' },
	{ id: 404 as KeywordId, label: '친절해요' },
	{ id: 405 as KeywordId, label: '대기공간 있어요' },
	{ id: 406 as KeywordId, label: '애견동반' },
];

export const ATMOSPHERE_KEYWORDS: Keyword[] = [
	{ id: 501 as KeywordId, label: '데이트추천' },
	{ id: 502 as KeywordId, label: '한적한 분위기' },
	{ id: 503 as KeywordId, label: '가족 외식' },
	{ id: 504 as KeywordId, label: '시끌벅적' },
	{ id: 505 as KeywordId, label: '사진 맛집' },
	{ id: 506 as KeywordId, label: '혼밥 가능' },
];

export const ACCESSIBILITY_KEYWORDS: Keyword[] = [
	{ id: 601 as KeywordId, label: '주차장 있어요' },
	{ id: 602 as KeywordId, label: '찾기 쉬워요' },
	{ id: 603 as KeywordId, label: '대중교통 편리' },
];

// 모든 키워드 데이터를 카테고리별로 묶어서 export
export const KEYWORDS_BY_CATEGORY: Record<KeywordCategory, Keyword[]> = {
	food: FOOD_KEYWORDS,
	cleanliness: CLEANLINESS_KEYWORDS,
	price: PRICE_KEYWORDS,
	service: SERVICE_KEYWORDS,
	atmosphere: ATMOSPHERE_KEYWORDS,
	accessibility: ACCESSIBILITY_KEYWORDS,
};

// API 제출 시, ID를 서버가 요구하는 ENUM 문자열로 변환하기 위한 전체 맵
// export const KEYWORD_ID_TO_ENUM_MAP: Record<KeywordId, string> = {
// 	101: 'FRESH',
// 	102: 'GENEROUS_PORTIONS',
// 	201: 'CLEAN_STORE',
// 	// ... 모든 키워드에 대한 매핑 정보
// };
