import { forwardRef, useState } from 'react';

import { detailCategories } from '@/entities/cataegory/detailCategories';
import { mealOptions } from '@/entities/home/model/mockMealOptions';
import { getTimeAgo } from '@/entities/menu/utils';
import clsx from 'clsx';
import Image from 'next/image';

import Icon, { IconProps } from '@/shared/ui/Icon';
import StarRating from '@/shared/ui/StarRating';

export interface Tooltip {
	id: number;
	rating?: number;
	servingSize?: number;
	detailedReview?: string;
	type: 'FOOD' | 'SERVICE' | 'CLEANLINESS';
	menuName?: string;
	totalPrice?: number;
}
export interface ReviewImage {
	imageId: string;
	imageUrl: string;
	imageOrder: number;
	isMain: boolean;
	tooltips: Tooltip[];
}
export interface ReviewCardProps {
	review: {
		id: number;
		author: {
			id: number;
			nickname: string;
			profileImageUrl?: string;
			reviewCount?: number;
			averageRating?: number;
		};
		reviewRating: number;
		images: ReviewImage[];
		keywords: string[];
		mealTime: 'BREAKFAST' | 'LUNCH' | 'DINNER';
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
		const [, setRating] = useState(review.reviewRating ?? 0);
		const [, setSelected] = useState(false);

		const handleClick = () => {
			setSelected(true);
		};

		return (
			<div
				ref={ref}
				data-id={review.id}
				className={clsx(
					' flex flex-col pb-[100px] w-full gap-2',
					isCurrent ? 'bg-primary-10' : 'bg-white',
				)}
			>
				{/* 상단: 프로필 & 시간 */}
				{isCurrent && (
					<div className="flex items-center gap-2 mb-2 text-white font-semibold">
						<Icon name="ReviewCurrent" size="xs" />
						<span className="text-primary-50 text-[9px]">
							지금 보고 있는 리뷰
						</span>
					</div>
				)}

				<div className="flex gap-2 items-center justify-between">
					<div className="flex flex-col">
						<div className="flex items-center gap-4">
							<span>
								{review.author.profileImageUrl ? (
									<div className="rounded-full w-[28px] h-[28px]">
										<Image
											src={review.author.profileImageUrl}
											alt={`${review.author.nickname} 프로필`}
											width={28}
											height={28}
											className="object-cover"
										/>
									</div>
								) : (
									<Icon name="Avatar" size="s" className="text-grey-60" />
								)}
							</span>
							<div className="flex flex-col">
								<div className="flex flex-wrap -mb-1">
									<span className="font-semibold text-[12px]">
										{review.author.nickname}
									</span>
									<span className="text-grey-70 text-[11px] ml-2">
										평균 {review.author.averageRating?.toFixed(1)}점
									</span>
									<span className="text-grey-70 text-[11px]">
										({review.author.reviewCount}개)
									</span>
								</div>

								<div className="flex items-center justify-between mt-2">
									<StarRating
										value={review.reviewRating}
										onChange={setRating}
										className="mb-1"
										iconSize="xxs"
									/>
									<div className="flex items-center text-sm text-grey-50 whitespace-nowrap">
										{(() => {
											const meal = mealOptions.find(
												(r) => r.iconName === review.mealTime.toLowerCase(),
											);
											if (!meal) return null;
											return (
												<div className="flex items-center gap-1">
													<Icon
														name={meal.iconName}
														size="xxs"
														className="ml-1"
													/>
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
					{review.gasimbi && (
						<div>
							{/* 가심비 박스 */}
							{review.gasimbi !== undefined && (
								<div
									className={`px-1 py-1 text-xs font-medium rounded-md text-white ${
										review.gasimbi >= 80
											? 'border border-[#00C79F] text-white bg-gradient-to-r from-[#00C79F] to-[#59A387]'
											: review.gasimbi >= 50
												? 'border border-blue-500 text-white bg-gradient-to-r from-[#3AC8FF] to-[#3A78FF]'
												: review.gasimbi >= 30
													? 'border border-[#FF893A] text-white bg-gradient-to-r from-[#FFB885] to-[#FF6600]'
													: 'bg-gray-200 text-white'
									}`}
								>
									<div className="flex items-center gap-0.5">
										<Icon
											name={
												review.gasimbi >= 80
													? 'greenHeart'
													: review.gasimbi >= 50
														? 'orangeHeart'
														: review.gasimbi >= 30
															? 'GasimbiHeart'
															: 'None'
											}
											size="xs"
										/>
										내 가심비
										<div className="ml-0.3">{review.gasimbi}점</div>
									</div>
								</div>
							)}
						</div>
					)}
					{review.keywords.map((kw) => {
						const category = detailCategories.find(
							(c) =>
								['food', 'service', 'clean'].includes(c.id) &&
								c.options.some((o) => o.label === kw),
						);

						const iconMap: Record<string, IconProps['name']> = {
							food: 'Foods',
							service: 'OrangeService',
							clean: 'Cleans',
						};
						const iconName = category ? iconMap[category.id] : undefined;

						return (
							<div
								key={kw}
								className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-white text-grey-80 text-[11px]"
							>
								{iconName && <Icon name={iconName} size="xxs" />}
								<span>{kw}</span>
							</div>
						);
					})}
				</div>

				{/* 리뷰 이미지 */}
				{review.images && review.images.length > 0 ? (
					<div className="flex gap-2 flex-wrap">
						{review.images.map((image) => (
							<Image
								key={image.imageId}
								src={image.imageUrl as string}
								alt="리뷰 이미지"
								width={89}
								height={89}
								className="rounded-md object-cover w-[65px] h-[65px]"
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col">
						<span className="">
							<Icon name="KoreanDish" size="xxl"></Icon>
						</span>
						<div className="w-full h-[200px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-md">
							사진을 준비하고 있어요
						</div>
					</div>
				)}

				{/* 리뷰 텍스트 & 메뉴 */}
				<div className="flex flex-col gap-2">
					{review.images.length > 0 && (
						<div className="">
							{review.images.flatMap((img) =>
								img.tooltips
									.filter((tt) =>
										['FOOD', 'SERVICE', 'CLEANLINESS'].includes(tt.type),
									)
									.map((tt) => {
										const iconMap: Record<string, IconProps['name']> = {
											FOOD: 'Foods',
											SERVICE: 'OrangeService',
											CLEANLINESS: 'Cleans',
										};
										const iconName = iconMap[tt.type];

										return (
											<div
												key={`${img.imageId}-${tt.id}`}
												className="flex flex-col gap-1 sm:w-[150px] w-[130px]"
											>
												<div className="flex gap-1 p-1 rounded-2xl bg-white text-grey-90 text-[11px]">
													{iconName && <Icon name={iconName} size="xxs" />}
													{<span>{tt.rating}</span>}
													{tt.menuName && <span>- {tt.menuName}</span>}
													{tt.totalPrice && (
														<span>- {tt.totalPrice.toLocaleString()}원</span>
													)}
												</div>
												{
													<div className=" text-[12px] text-grey-85">
														{tt.detailedReview}
													</div>
												}
											</div>
										);
									}),
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

ReviewCard.displayName = 'ReviewCard';
export default ReviewCard;
