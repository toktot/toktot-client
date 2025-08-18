import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { BaseReviewView } from '../model/view';

// import { RatingStarView } from './RatingStarView';

interface ReviewDetailItemProps {
	review: BaseReviewView;
	isSelected?: boolean;
}

export const ReviewDetailItem = ({
	review,
	isSelected,
}: ReviewDetailItemProps) => {
	return (
		<div className="py-3">
			{isSelected && (
				<div className="flex gap-2 items-center text-sky-400 mb-[10px]">
					<Icon
						name={'Check'}
						size="xxs"
						className="rounded-full bg-primary-20"
					/>
					<h3 className="text-xs font-bold">지금 보고 있는 리뷰</h3>
				</div>
			)}
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
					<span className="font-bold">{review.author.nickname}</span>
					<span className="text-grey-70">
						평균 {review.author.averageRating}
					</span>
				</div>
				<span className="text-sm text-grey-60">{review.createdAt}</span>
			</div>

			<div className="my-2">
				{/* <RatingStarView
					value={Object.values(review.tooltips)[0]?.rating ?? 0}
					category={Object.values(review.tooltips)[0]?.category ?? 'food'}
				/> */}
			</div>
			<div className="flex gap-2 h-[65px]">
				{review.images.map((image) => (
					<Image
						key={image.id}
						src={image.url}
						width={65}
						height={65}
						alt={'리뷰 이미지'}
						className="rounded-lg"
					/>
				))}
			</div>

			<p className="text-sm text-grey-90">{'상세 설명이 없습니다.'}</p>
		</div>
	);
};
