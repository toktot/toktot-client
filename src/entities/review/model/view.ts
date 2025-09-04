import { Keyword } from '@/entities/keyword/config/data';
import { StoreData } from '@/entities/store';

import { ReviewId, TooltipId } from '@/shared/model/types';

import { Author } from './author';
import { BaseReviewImage } from './image';
import { Tooltip } from './tooltip';

/**
 * @description 클라이언트에서 사용하는 리뷰 뷰 모델. 서버 데이터가 변환된 형태입니다.
 */
export interface ReviewView {
	id: ReviewId;
	author: Author;
	store: StoreData;
	createdAt: string;
	images: (BaseReviewImage & { tooltipIds: TooltipId[] })[];
	keywords: Keyword['label'][];
	tooltips: Record<TooltipId, Tooltip>;
    satisfactionScore: number;
    mealTime: string;
    isBookmarked: boolean;
    isWriter: boolean;
}

export const SERVER_CATEGORY_MAP = {
	FOOD: 'food',
	SERVICE: 'service',
	CLEAN: 'clean',
} as const;

export type ServerTooltipCategory = keyof typeof SERVER_CATEGORY_MAP;