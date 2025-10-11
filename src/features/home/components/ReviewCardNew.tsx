'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SimpleStore, {
	SimpleStoreProps,
} from '@/shared/components/SimpleStoreCard';
import Icon from '@/shared/ui/Icon';

interface Author {
	id: number;
	nickname: string;
	profileImageUrl: string | null;
	reviewCount: number;
	averageRating: number;
}

interface Restaurant {
	id: number;
	name: string;
	representativeMenu: string | null;
	address: string;
	distanceInKm: string | null;
}

export interface PopularReview {
	id: number;
	author: Author;
	isBookmarked: boolean;
	valueForMoneyScore: number;
	keywords: string[];
	imageUrl: string | null; // 이미지 없을 수도 있음
	restaurant: Restaurant;
	rating: number | null;
}

interface PhotoReviewCardProps {
	review: PopularReview;
	stores: SimpleStoreProps['review'][];
}

export default function PhotoReviewCard({ review }: PhotoReviewCardProps) {
	const hasImage = !!review.imageUrl;
	const router = useRouter();
	return (
		<div
			className="w-[290px] bg-white rounded-xl overflow-hidden cursor-pointer"
			style={{
				borderColor: '#F6F9FB',
				boxShadow: '0 0 6px rgba(208, 214, 225, 0.3)',
			}}
		>
			<div
				className=""
				onClick={() =>
				{
					console.log('리뷰 클릭됨:', {
						reviewId : review.id,
						authorId: review.author.id
					})
					router.push(
						`/review/view?reviewId=${review.id}&authorId=${review.author.id}`,
					)
				}
			}
			>
				{/* 상단 프로필 + 닉네임 + 별점 */}
				<div className="flex items-center justify-between p-2">
					<div className="flex items-center gap-2">
						<div className="relative w-7 h-8 rounded-full overflow-hidden flex items-center justify-center">
							{review.author.profileImageUrl ? (
								<Image
									src={review.author.profileImageUrl}
									alt={`${review.author.nickname} 프로필`}
									fill
									className="object-cover"
								/>
							) : (
								<Icon name="Avatar" size="xxl" />
							)}
						</div>

						<div className="flex flex-col">
							<span className="text-sm font-semibold">
								{review.author.nickname}
							</span>
							<span className="text-xs text-gray-400">
								{review.author.reviewCount || 0}개 · 평균{' '}
								{typeof review.author.averageRating === 'number' ? review.author.averageRating.toFixed(1) : '0.0'}점 ·{' '}
								{/*{review.date}*/}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<Icon
							name={'Star'}
							fill="#40D7F5"
							className="outline-none stroke-0 "
							color="#40D7F5"
							size="xxs"
						/>
						<span className="text-sm font-medium">
							{typeof review.rating === 'number' ? review.rating?.toFixed(1) : '0.0'}
						</span>
					</div>
				</div>

				{/* 리뷰 이미지 */}
				<div className="relative w-[290px] h-[282px]">
					{hasImage ? (
						<Image
							src={review.imageUrl as string}
							alt={`${review.author.nickname} 리뷰 이미지`}
							fill
							className="object-cover"
						/>
					) : (
						<div className="w-full h-[200px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm">
							사진을 준비하고 있어요
						</div>
					)}
					{(review.valueForMoneyScore || review.keywords.length > 0) && (
						<div className="absolute bottom-0 left-0 flex flex-wrap gap-2 px-2 pb-2 pt-2">
							{/* 가심비 박스 */}
							{review.valueForMoneyScore !== undefined && (
								<div
									className={`px-1 py-1.5 text-xs font-medium rounded-md text-white ${
										review.valueForMoneyScore >= 80
											? 'border border-[#00C79F] text-white bg-gradient-to-r from-[#00C79F] to-[#59A387]'
											: review.valueForMoneyScore >= 50
												? 'border border-blue-500 text-white bg-gradient-to-r from-[#3AC8FF] to-[#3A78FF]'
												: review.valueForMoneyScore >= 30
													? 'border border-[#FF893A] text-white bg-gradient-to-r from-[#FFB885] to-[#FF6600]'
													: 'bg-gray-200 text-white'
									}`}
								>
									<div className="flex items-center gap-0.5">
										<Icon
											name={
												review.valueForMoneyScore >= 80
													? 'greenHeart'
													: review.valueForMoneyScore >= 50
														? 'orangeHeart'
														: review.valueForMoneyScore >= 30
															? 'GasimbiHeart'
															: 'None'
											}
											size="xs"
										/>
										내 가심비
										<div className="ml-0.3">{review.valueForMoneyScore}점</div>
									</div>
								</div>
							)}
						</div>
					)}

					<div className="absolute bottom-2 right-2 p-2 bg-[rgba(23,29,41,0.5)] rounded-full flex items-center justify-center">
						<Icon name="Bookmark" className=" text-white" />
					</div>
				</div>
				<p className="text-xs text-white line-clamp-2 pr-10 mr-10">
					{/*
						{review.text && review.text.length > 25 ? (
							<>
								{review.keywords.length > 0 ? review.keywords.join(', ') : ''}
								<span className="text-grey-60">...더보기</span>
							</>
						) : (
							review.text
						)}
							*/}
				</p>

				{/* 설명 및 북마크 */}
			</div>
			{/* SimpleStore 카드 예시 (맨 아래) */}
			{review.restaurant && (
				<div className="mt-2 bg-grey-10">
					<SimpleStore
						review={{
							id: review.restaurant.id,
							storeImageUrl: review.imageUrl as string,
							storeName: review.restaurant.name,
							mainMenus: review.restaurant.representativeMenu
								? [JSON.parse(review.restaurant.representativeMenu).treatMenu]
								: [],
							reviewCount: review.author.reviewCount,
							valueScore: review.valueForMoneyScore,
							topPercent: '',
							rating: review.rating ?? 0,
							mainMenu: review.restaurant.representativeMenu
								? JSON.parse(review.restaurant.representativeMenu).firstMenu
								: '',
							address: review.restaurant.address,
							distance: review.restaurant.distanceInKm,
						}}
					/>
				</div>
			)}
		</div>
	);
}
