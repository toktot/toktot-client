import { StoreData } from '@/entities/store';
import { MoodKeyword } from '@/entities/store/mood/model/types';

import { User } from '@/features/auth/types/auth';

import { ReviewImage } from './image';

export interface Review {
	id: string;
	authorId: User['id'];
	storeId: StoreData['id'];
	imageIds: ReviewImage['id'][];
	moodKeywordIds: MoodKeyword['id'][];
}
