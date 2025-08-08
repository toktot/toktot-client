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
			<div className="relative rounded-lg overflow-hidden shadow-md">
				<Image
					src={review.imageUrl}
					alt={review.placeName}
					width={185}
					height={210}
					className="w-full h-36 object-cover"
				/>
				<Icon
					name={'Etc'}
					className="absolute top-2 right-2 transform rotate-90 text-white"
				/>
				<div className="p-2">
					<h3 className="text-sm font-semibold">{review.placeName}</h3>
					<p className="text-xs text-gray-500">
						{review.location} · {review.distance}
					</p>
				</div>
			</div>
		</div>
	);
};
export default ReviewStoreCard;
