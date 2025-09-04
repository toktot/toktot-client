import { Keyword } from '@/entities/keyword/config/data';

import { ReviewId, TooltipId } from '@/shared/model/types';

import { Author } from './author';
import { BaseReviewImage } from './image';
import { Tooltip } from './tooltip';

/**
 * @description 리뷰 목록 등에서 사용될 기본적인 리뷰 정보 모델.
 *              상세 툴팁 객체(tooltips)는 포함하지 않습니다.
 */
export interface BaseReviewView {
	id: ReviewId;
	author: Author;
	createdAt: string;
	// images 배열은 tooltipIds를 포함할 수 있으므로, InteractiveReviewImage 또는 유사한 타입을 사용
	images: (BaseReviewImage & { tooltipIds: TooltipId[] })[];
	keywords: Keyword['label'][];
}

/**
 * @description 리뷰 작성/탐색처럼 모든 정보가 필요한 컨텍스트에서 사용될 모델.
 *              BaseReviewView를 확장하여, 해석된 툴팁 객체 맵(tooltips)을 포함합니다.
 */
export interface ReviewWithTooltipView extends BaseReviewView {
	tooltips: Tooltip[];
}

// 기존 코드와의 호환성 또는 명확성을 위해 ReviewView를 DetailedReviewView의 별칭으로 사용할 수 있습니다.
export type ReviewView = ReviewWithTooltipView;

export const SERVER_CATEGORY_MAP = {
	FOOD: 'food',
	SERVICE: 'service',
	CLEAN: 'clean',
} as const;

export type ServerTooltipCategory = keyof typeof SERVER_CATEGORY_MAP;
