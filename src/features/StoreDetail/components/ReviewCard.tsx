import { forwardRef, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { getTimeAgo } from '@/entities/menu/utils';
import clsx from 'clsx';
import Image from 'next/image';

import Icon, { IconProps } from '@/shared/ui/Icon';
import StarRating from '@/shared/ui/StarRating';

import CategoryTag from './CategoryTag';

export interface ReviewCardProps {
	review: {
		id: number;
		auth: {
			id?: number;
			nickname: string;
			profileImageUrl?: string;
			reviewCount?: number;
			averageRating?: number;
		};
		rating: number;
		images: {
			id: number;
			imageUrl: string;
			menus: { menuName: string; totalPrice: number }[];
		}[];
		mealTime: string;
		date: string;
		gasimbi?: number;
		text?: {
			service?: [id: number, rating: number, texts: string];
			food?: [id: number, rating: number, texts: string];
			clean?: [id: number, rating: number, texts: string];
		};
		type: string;
		categories: {
			service?: number[];
			food?: number[];
			clean?: number[];
		};
	};
	isCurrent?: boolean;
}

const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
	({ review, isCurrent = false }, ref) => {
		const [rating, setRating] = useState(review.rating ?? 0);
		const [selected, setSelected] = useState(false);
		console.log(rating, selected);

		const handleClick = () => {
			setSelected(true);
		};

		return (
			<div
				ref={ref}
				data-id={review.id}
				className={clsx(
					'rounded-3xl p-4 w-full flex flex-col gap-3',
					isCurrent ? 'bg-primary-40' : 'bg-white',
				)}
			>
				{/* 상단: 프로필 & 시간 */}
				{isCurrent && (
					<div className="flex items-center gap-2 mb-2 text-white font-semibold">
						<Icon name="Checkmark" className="w-4 h-4" />
						<span>지금 보고 있는 리뷰</span>
					</div>
				)}

				<div className="flex gap-2 items-center justify-between">
					<div className="flex flex-col">
						<div className="flex items-center gap-1">
							<span className="font-semibold text-[12px]">
								{review.auth.nickname}
							</span>
							<span className="text-grey-70 text-[11px]">
								평균 ({review.auth.averageRating?.toFixed(1)}점)
							</span>
							<span className="text-grey-70 text-[11px]">
								({review.auth.reviewCount}개)
							</span>
						</div>

						<div className="flex items-center justify-between mt-2 gap-2">
							<StarRating
								value={review.rating}
								onChange={setRating}
								className="mb-1"
								iconSize="xxs"
							/>
							<div className="flex items-center text-sm text-grey-50 whitespace-nowrap">
								{(() => {
									const meal = mealOptions.find(
										(r) => r.label === review.mealTime,
									);
									if (!meal) return null;
									return (
										<div className="flex items-center gap-1">
											<Icon name={meal.iconName} size="xxs" />
											<span className="text-grey-60 text-[9px]">
												{meal.label}
											</span>
										</div>
									);
								})()}
								<span>・</span>
								<span className="text-[9px] text-grey-60">
									{getTimeAgo(review.date)}
								</span>
							</div>
						</div>
					</div>

					<Icon
						name="Etc"
						className="top-2 right-2 transform rotate-90 ml-auto text-grey-70"
						size="xs"
						onClick={handleClick}
					/>
				</div>

				{/* 가심비 & 카테고리 태그 */}
				<div className="flex flex-wrap gap-2">
					<div
						className={clsx(
							'px-2 py-0.5 rounded-md font-semibold text-sm border',
							review.gasimbi! >= 80
								? 'bg-green-100 border-green-600 text-green-600'
								: review.gasimbi! >= 50
									? 'bg-blue-100 border-blue-500 text-blue-500'
									: review.gasimbi! >= 30
										? 'bg-orange-100 border-orange-500 text-orange-500'
										: 'bg-grey-10 border-grey-300 text-grey-50',
						)}
					>
						가심비 {review.gasimbi ?? 0}점
					</div>
					{Object.entries(review.categories ?? {}).map(([catId, ids]) => {
						const category = detailCategories.find((c) => c.id === catId);
						if (!category) return null;

						return ids.map((optId: number) => {
							const option = category.options.find((o) => o.id === optId);
							if (!option) return null;
							return (
								<CategoryTag
									key={`${catId}-${optId}`}
									label={category.label}
									text={option.label}
								/>
							);
						});
					})}
				</div>

				{/* 리뷰 이미지 */}
				{review.images.map((image) => (
					<Image
						key={image.id}
						src={image.imageUrl}
						alt="리뷰 이미지"
						width={65}
						height={65}
						className="rounded-md object-cover w-[65px] h-[65px]"
					/>
				))}

				{/* 리뷰 텍스트 & 메뉴 */}
				<div className="flex flex-col gap-1">
					{Object.entries(review.text ?? {}).map(([key, value]) => {
						if (!value) return null;

						const [ratingValue, texts] = value;
						const labelToIcon: Record<string, IconProps['name']> = {
							food: 'Star',
							service: 'Service',
							clean: 'Clear',
						};

						const iconName = labelToIcon[key] ?? 'Star';

						const colorMap: Record<string, { fill: string; border: string }> = {
							Service: { fill: '#11BB69', border: '#11BB69' },
							Clear: { fill: '#FF893A', border: '#FF893A' },
							Star: { fill: '#38DEFF', border: '#38DEFF' },
						};
						const { fill } = colorMap[iconName] || {
							fill: '#999999',
							border: '#999999',
						};

						return (
							<div key={key} className="flex flex-col gap-1">
								<div className="flex items-start gap-2">
									<div className="flex items-center rounded-full px-0.5 py-1 gap-1">
										<Icon name={iconName} size="xxs" color={fill} fill={fill} />
										<span className="text-[11px] text-grey-90">
											{ratingValue}
										</span>
										{key === 'food' && review.images.length > 0 && (
											<div className="flex flex-wrap gap-2 ml-5">
												{review.images.map((img) =>
													img.menus.map((menu, idx) => (
														<span
															key={`${img.id}-${idx}`}
															className="text-[11px] text-grey-70"
														>
															{menu.menuName} -{' '}
															{menu.totalPrice.toLocaleString()}원
														</span>
													)),
												)}
											</div>
										)}
									</div>
								</div>
								<div className="text-[12px] text-grey-90 mt-0.5">{texts}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	},
);

ReviewCard.displayName = 'ReviewCard';
export default ReviewCard;
