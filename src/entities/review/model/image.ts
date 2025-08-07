import { ReviewImageId, TooltipId } from '@/shared/model/types';

export interface ReviewImage {
	id: ReviewImageId;
	url: string;
	file?: File;
	tooltipIds: TooltipId[];
}
