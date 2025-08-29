'use client';

import { Store } from '@/entities/store/model/mockStore';
import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import Image from 'next/image';

import TopPercentTag from '@/features/home/model/TopPercentTag';

import Icon from '@/shared/ui/Icon';

import GasimbiTag from '../model/GasimbiCategory';

interface Props {
	review: Store;
}

export default function StoreCardNew({ review }: Props) {
	return (
		<div className="w-[343px] h-[232px] bg-white rounded-xl shadow-md overflow-hidden">
			{/* 상단 이미지 */}
			<div className="relative w-[343px] h-[122px]">
				<Image
					src={review.storeImageUrl}
					alt={`${review.storeName} 이미지`}
					fill
					className="object-cover"
				/>
				{review.isKindStore && (
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
						{review.storeName}
					</span>
					{review.mainMenus && (
						<span className="text-xs text-gray-500 truncate">
							{review.mainMenus.slice(0, 2).join(', ')}
						</span>
					)}
					<Icon name="Star" size="xxs" className="text-yellow-500" />
					<span className="text-[11px] -ml-1">{review.rating.toFixed(1)}</span>
					<span className="text-grey-90 text-[11px] -ml-1">
						({review.reviewCount})
					</span>
				</div>

				{/* 메뉴 가격 (첫 번째 메뉴) */}
				{review.menuPrices?.[0] && (
					<div className="text-[16px] font-medium text-grey-90">
						주 메뉴 약 {review.menuPrices[0].price.toLocaleString()}원
					</div>
				)}

				{/* 태그들 */}
				<div className="flex items-center gap-1 text-xs mt-1">
					{review.topPercent && <TopPercentTag value={review.topPercent} />}
					{review.valueScore !== undefined && (
						<GasimbiTag value={review.valueScore} />
					)}
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
