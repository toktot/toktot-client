'use client';

import Image from 'next/image';

import TopPercentTag from '@/features/home/model/TopPercentTag';

import SimpleStore, {
	SimpleStoreProps,
} from '@/shared/components/SimpleStoreCard';
import Icon from '@/shared/ui/Icon';

import { getGasimbiStyle } from './ImageCategory';

export interface ReviewProps {
	review: {
		id: number;
		nickname: string;
		profileImageUrl?: string;
		reviewCount?: number;
		averageRating?: number;
		gasimbi?: number;
		image: string;
		menu: string[];
		date: string;
		mealTime: string;
		type?: string;
		rating: number;
		text?: string;
		isKindStore?: boolean;
		mainMenus?: string[];
		topPercent?: string;
		address?: string;
		popular?: number;
		placeName?: string;
	};
	stores: SimpleStoreProps['review'][];
}

export default function PhotoReviewCard({ review, stores }: ReviewProps) {
	const matchedStore = stores.find(
		(store) => store.storeName === review.placeName,
	);

	const gasimbiStyle = getGasimbiStyle(review.gasimbi);

	return (
		<div
			className="w-[290px] bg-white rounded-xl shadow-md overflow-hidden"
			style={{
				boxShadow: '0 2px 10px rgba(0,0,0,0.15), 0 0 10px rgba(0,0,0,0.1)',
			}}
		>
			{/* 상단 프로필 + 닉네임 + 별점 */}
			<div className="flex items-center justify-between p-2">
				<div className="flex items-center gap-2">
					<div className="relative w-7 h-8 rounded-full overflow-hidden">
						<Image
							src={review.profileImageUrl || '/images/default-profile.png'}
							alt={`${review.nickname} 프로필`}
							fill
							className="object-cover"
						/>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">{review.nickname}</span>
						<span className="text-xs text-gray-400">
							{review.reviewCount || 0}개 · 평균{' '}
							{review.averageRating?.toFixed(1) || 0} · {review.date}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<Icon
						name={'Star'}
						fill="#3AC8FF"
						className="outline-none stroke-0 "
						color="#3AC8FF"
						size="xxs"
					/>
					<span className="text-sm font-medium">{review.rating}</span>
				</div>
			</div>

			{/* 리뷰 이미지 */}
			<div className="relative w-[290px] h-[282px]">
				<Image
					src={review.image}
					alt={`${review.nickname} 리뷰 이미지`}
					fill
					className="object-cover"
				/>
				<div className="absolute bottom-0 w-full p-2">
					<div className="relative">
						<p className="text-xs text-white line-clamp-2 pr-10 mr-10">
							{review.text && review.text.length > 25 ? (
								<>
									{review.text.slice(0, 25)}
									<span className="text-grey-60">...더보기</span>
								</>
							) : (
								review.text
							)}
						</p>
						<Icon
							name="Bookmark"
							className="absolute bottom-0 right-0 text-white"
						/>
					</div>
				</div>
			</div>

			{/* 설명 및 북마크 */}

			{(review.gasimbi || review.topPercent) && (
				<div className="flex flex-wrap gap-2 px-2 pb-2 pt-2">
					{review.gasimbi !== undefined && (
						<div
							className={`inline-flex p-[1.5px] ${
								review.gasimbi >= 80
									? 'border border-gradient-to-r from-[#00C79F] to-[#006218] bg-grey-10'
									: review.gasimbi >= 50
										? 'border-2 border-gradient-to-r from-[#006FFF] to-[#3AC8FF] bg-grey-10'
										: review.gasimbi >= 30
											? 'bg-gradient-to-r from-[#FFB885] to-[#FF6600] bg-grey-10'
											: 'bg-gray-200'
							} `}
						>
							<span className={`text-xs font-medium ${gasimbiStyle.text}`}>
								{review.nickname}님의 가심비 {review.gasimbi}점
							</span>
						</div>
					)}
					{review.topPercent && <TopPercentTag value={review.topPercent} />}
				</div>
			)}

			{/* SimpleStore 카드 예시 (맨 아래) */}
			{matchedStore && (
				<div className="mt-2 bg-grey-10">
					<SimpleStore review={matchedStore} />
				</div>
			)}
		</div>
	);
}
