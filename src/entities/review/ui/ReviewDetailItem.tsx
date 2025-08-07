import { ReviewView } from '@/entities/review';
import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { RatingStarView } from './RatingStarView';

interface ReviewDetailItemProps {
	review: ReviewView;
	isSelected?: boolean;
}

export const ReviewDetailItem = ({
	review,
	isSelected,
}: ReviewDetailItemProps) => {
	// 이 리뷰에 포함된 모든 'food' 카테고리 툴팁을 찾습니다.
	const foodTooltips = Object.values(review.tooltips).filter(
		(t) => t.category === 'food',
	);

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
					<span className="font-bold">{review.author.name}</span>
					<span className="text-grey-70">평균</span>
				</div>
				<span className="text-sm text-grey-60">{review.createdAt}</span>
			</div>
			{/* 전체 리뷰에 대한 별점 (첫 번째 툴팁의 별점을 대표로 사용) */}
			<div className="my-2">
				<RatingStarView
					value={Object.values(review.tooltips)[0]?.rating ?? 0}
					category={Object.values(review.tooltips)[0]?.category ?? 'food'}
				/>
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
			{foodTooltips.length > 0 && (
				<ul className="my-2 space-y-1 rounded-lg bg-grey-10 text-sm">
					{foodTooltips.map((tip) => (
						<li
							key={tip.id}
							className="flex rounded-2xl w-fit px-2 py-1 bg-slate-200 gap-1 text-grey-80"
						>
							<span>{tip.menuName},</span>
							<span>{tip.price.toLocaleString()}원</span>
						</li>
					))}
				</ul>
			)}
			<p className="text-sm text-grey-90">
				{Object.values(review.tooltips)[0]?.description ||
					'상세 설명이 없습니다.'}
			</p>
		</div>
	);
};
