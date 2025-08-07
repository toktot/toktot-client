import { User } from '@/features/auth/types/auth';

import {
	MoodKeywordId,
	ReviewId,
	ReviewImageId,
	StoreId,
} from '@/shared/model/types';

export interface Review {
	id: ReviewId;
	authorId: User['id'];
	storeId: StoreId;
	imageIds: ReviewImageId[];
	moodKeywordIds: MoodKeywordId[];
}
