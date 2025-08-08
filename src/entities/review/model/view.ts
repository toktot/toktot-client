import { StoreData } from '@/entities/store';
import { MoodKeyword } from '@/entities/store/mood/model/types';
import { User } from '@/entities/user/types/auth';

import { ReviewId, TooltipId } from '@/shared/model/types';

import { ReviewImage } from './image';
import { Tooltip } from './tooltip';

export interface ReviewView {
	id: ReviewId;
	author: User;
	store: StoreData;
	createdAt: string;
	images: ReviewImage[];
	tooltips: Record<TooltipId, Tooltip>;
	moodKeywords: MoodKeyword[];
}
