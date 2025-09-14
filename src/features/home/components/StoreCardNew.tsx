'use client';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

import GasimbiTag from '../model/GasimbiCategory';
import TopPercentTag from '../model/TopPercentTag';

interface GoodPriceStore {
	review: {
		id: number;
		name: string;
		distance: string;
		main_menus: string;
		average_rating: number;
		address: string;
		review_count: number;
		is_good_price_store: boolean;
		is_local_store: boolean;
		image: string;
		point: number;
		percent: number;
	};
}

export default function StoreCardNew({ review }: GoodPriceStore) {
	const router = useRouter();
	return (
		<div className="min-w-[343px] max-w-[430px] w-full h-[232px] bg-white rounded-xl shadow-md overflow-hidden">
			{/* 상단 이미지 */}
			<div
				className="relative min-w-[343px] max-w-[430px] w-full h-[122px] justify"
				onClick={() => router.push(`/storemenu/${review.id}`)}
			>
				{review.image ? (
					<Image
						src={review.image}
						alt={`${review.name} 이미지`}
						fill
						className="object-cover"
					/>
				) : (
					<div className="min-w-[343px] max-w-[430px] h-[122px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-t-xl">
						<div className="flex flex-col flex items-center">
							<span className="">
								<Icon name="KoreanDish" size="xxl"></Icon>
							</span>
							<div className="">사진을 준비하고 있어요</div>
						</div>
					</div>
				)}
				{review.is_good_price_store && (
					<div className="absolute top-2 left-2">
						<StoreCategoryTag
							className="text-[9px] px-1 py-0.3"
							type="착한가게"
						/>
					</div>
				)}
			</div>

			{/* 본문 영역 */}
			<div className="px-3 py-2 flex flex-col gap-1">
				{/* 가게명 + 대표메뉴 */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-gray-900">
						{review.name}
					</span>
					{review.main_menus && (
						<span className="text-xs text-gray-500 truncate">
							{review.main_menus}
						</span>
					)}
					<Icon name="Star" size="xxs" className="text-yellow-500" />
					<span className="text-[11px] -ml-1">
						{review.average_rating.toFixed(1)}
					</span>
					<span className="text-grey-90 text-[11px] -ml-1">
						({review.review_count})
					</span>
				</div>

				{/* 메뉴 가격 (첫 번째 메뉴) */}
				{review.main_menus}

				<div className="flex items-center gap-1 text-xs mt-1">
					{review.percent && <TopPercentTag value={review.percent} />}
					{review.point !== undefined && <GasimbiTag value={review.point} />}
				</div>

				{/* 주소 + 거리 */}
				<div className="text-xs text-grey-70 flex items-center mt-1">
					<Icon name="Location" size="xxs" />
					<span className="ml-1">
						{review.address} · {review.distance}
					</span>
				</div>
			</div>
		</div>
	);
}
