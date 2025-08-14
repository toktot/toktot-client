import React from 'react';

import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { Review } from '../model/mockHome';

interface ReviewStoreCardProps {
	review: Review;
}
const ReviewStoreCard: React.FC<ReviewStoreCardProps> = ({ review }) => {
	return (
		<div className="w-[48%] mb-4">
			<div className="relative w-full h-52 overflow-hidden">
				<Image
					src={review.imageUrl}
					alt={review.placeName}
					fill
					className="object-cover"
				/>
				<Icon
					name={'Etc'}
					className="absolute top-2 right-2 transform rotate-90 text-white"
				/>
				<div className="absolute bottom-1 left-3 text-[9px] text-[#FFFFFF] ">
					{review.writer} · {review.time}전
				</div>
			</div>
			<div className="p-2">
				<h3 className="text-sm font-semibold">{review.placeName}</h3>
				<p className="text-xs text-grey-70 flex flex-wrap mt-0.5 flex items-center">
					<Icon name={'Location'} size="xxs" />
					{review.location} · {review.distance}
				</p>
			</div>
		</div>
	);
};
export default ReviewStoreCard;
