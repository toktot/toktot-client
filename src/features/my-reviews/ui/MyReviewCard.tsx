'use client';

import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { MyReview } from '../api/schema';

interface MyReviewCardProps {
	review: MyReview;
}

export const MyReviewCard = ({ review }: MyReviewCardProps) => {
	return (
		<div className="relative w-full h-[30vh] rounded-lg overflow-hidden shadow-md">
			{review.mainImageUrl ? (
				<Image
					src={review.mainImageUrl}
					alt={`${review.restaurant.name} 리뷰 이미지`}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
				/>
			) : (
				<div className="w-full h-full bg-grey-100 flex items-center justify-center">
					<Icon name="Logo" className="text-grey-300" size="l" />
				</div>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
				<h3 className="font-bold text-base truncate">
					{review.restaurant.name}
				</h3>
				<div className="flex items-center gap-1">
					<Icon name={'Location'} size="xxs" />
					<p className="text-xs text-grey-200 truncate">
						{review.restaurant.address}
					</p>
				</div>
			</div>
		</div>
	);
};
