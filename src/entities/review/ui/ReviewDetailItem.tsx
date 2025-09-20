import Image from 'next/image';

import { useRelativeTime } from '@/widgets/review/write/lib/getRelativeTime';

import { Label } from '@/shared/components/Label';
import Icon from '@/shared/ui/Icon';

import { ReviewClient } from '../api/schema';
import { TooltipCategory } from '../model/tooltip';
import {
	RATING_ICON_COLOR_FOR_CATEGORY,
	tooltipMarkerStyleMap,
} from '../model/tooltipStyleMap';
import { MealTimeDisplay } from './MealTimeDisplay';
import { RatingStarView } from './RatingStarView';

interface ReviewDetailItemProps {
	review: ReviewClient;
	isSelected?: boolean;
	selectedCategory?: TooltipCategory | 'all';
}

export const ReviewDetailItem = ({
	review,
	isSelected,
	selectedCategory = 'all',
}: ReviewDetailItemProps) => {
	const relativeTime = useRelativeTime(review.createdAt);

	return (
		<div className="py-3 flex flex-col gap-1">
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
			<div className="flex gap-[10px]">
				<div className="w-10 h-10 relative shrink-0">
					<Image
						src={review.author.profileImageUrl}
						fill
						sizes="40px"
						alt={'프로필 이미지'}
						className="object-cover rounded-full"
					/>
				</div>
				<div className="flex-1 gap-2 flex flex-col">
					<div>
						{/* 유저 정보 */}
						<div className="flex items-center justify-between">
							<div className="flex gap-2">
								<span className="font-bold w-1/2 truncate">
									{review.author.nickname}
								</span>
								<div className="text-grey-70 shrink-0">
									<span>평균 {review.author.averageRating.toFixed(1)}</span>
									<span>({review.author.reviewCount}개)</span>
								</div>
							</div>
						</div>
						{/* 리뷰 정보 */}
						<div className="flex gap-2 items-center text-sm text-grey-60">
							<RatingStarView value={review.reviewRating} category={'food'} />
							<MealTimeDisplay mealTime={review.mealTime} />
							<div>{relativeTime}</div>
						</div>
						{/* 키워드 */}
						<div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden mb-2">
							{review.keywords.map((keyword) => (
								<span
									key={keyword}
									className="rounded-lg px-2 text-xs bg-white shrink-0"
								>
									<Label>{keyword}</Label>
								</span>
							))}
						</div>
					</div>

					<div className="flex gap-2 overflow-x-auto">
						{review.images.map((image) => (
							<Image
								key={image.imageId}
								src={image.imageUrl}
								width={100}
								height={100}
								alt={'리뷰 이미지'}
								className="rounded-md object-cover w-[100px] h-[100px]"
							/>
						))}
					</div>

					{/* 툴팁 정보 */}
					<div className="space-y-2">
						{review.images.flatMap((image) =>
							image.tooltips
								.filter((tooltip) => {
									if (selectedCategory === 'all') return true;
									return tooltip.type.toLowerCase() === selectedCategory;
								})
								.map((tooltip) => {
									console.log('🚀 ~ tooltip:', tooltip);
									const categoryKey =
										tooltip.type.toLowerCase() as TooltipCategory;
									const markerStyle = tooltipMarkerStyleMap[categoryKey];
									const tooltipCategoryColor =
										RATING_ICON_COLOR_FOR_CATEGORY[categoryKey];

									return (
										<div
											key={tooltip.id}
											className="flex flex-col gap-1 text-xs"
										>
											<div className="flex gap-1 rounded-full w-fit px-2 bg-white">
												<Icon
													name={markerStyle.icon}
													fill={tooltipCategoryColor}
													color={tooltipCategoryColor}
													size={'xs'}
												/>
												<span>{tooltip.rating}</span>
												{tooltip.type === 'food' && (
													<>
														<span>{tooltip.menuName}</span>
														<span>
															{Number(tooltip.totalPrice).toLocaleString()}원
														</span>
													</>
												)}
											</div>
											<p className="text-sm">{tooltip.detailedReview}</p>
										</div>
									);
								}),
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
