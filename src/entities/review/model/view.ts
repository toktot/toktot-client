import { StoreData } from '@/entities/store';
import { MoodKeyword } from '@/entities/store/mood/model/types';

import { User } from '@/features/auth/types/auth';

import { ReviewImage } from './image';
import { Tooltip } from './tooltip';

export interface ReviewView {
	id: string;
	author: User;
	store: StoreData;
	createdAt: string;
	images: ReviewImage[];
	tooltips: Record<Tooltip['id'], Tooltip>;
	moodKeywords: MoodKeyword[];
}
