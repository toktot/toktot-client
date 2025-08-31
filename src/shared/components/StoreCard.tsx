'use client';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import GasimbiCategoryTag from '@/features/home/model/GasimbiCategory';
import TopPercentTag from '@/features/home/model/TopPercentTag';

import Icon from '@/shared/ui/Icon';

export interface StoreInfoCardProps {
	review: {
		id: number;
		storeImageUrl: string;
		storeName: string;
		isKindStore?: boolean;
		mainMenus: string[];
		reviewCount?: number;
		valueScore: number;
		topPercent: string;
		address: string;

		rating: number;
		distance?: string;
	};
}

export default function StoreInfoCard({ review }: StoreInfoCardProps) {
	const router = useRouter();
	return (
		<div
			className="flex gap-3 p-3 b-border-1 bg-white  w-full"
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative w-[89px] h-[100px]">
				<Image
					src={review.storeImageUrl}
					alt={`${review.storeName} 이미지`}
					fill
					className="block rounded-md object-cover"
				/>

				{review.isKindStore && (
					<div className="absolute top-1 left-1">
						<StoreCategoryTag
							className="text-[9px] px-1 py-0.3"
							type="착한가게"
						/>
					</div>
				)}
			</div>

			<div className="flex flex-col justify-between flex-1">
				<span className="text-[16px] font-semibold">{review.storeName}</span>
				<div className="flex items-center text-sm text-grey-80">
					<Icon name="Star" size="xs" className="text-yellow-500 mr-1" />
					<span className="mr-1">{review.rating.toFixed(1)}</span>
					<span className="text-grey-90 mr-2">({review.reviewCount})</span>

					<span className="truncate">
						{review.mainMenus.slice(0, 2).join(',')}
					</span>
				</div>
				<div className="flex items-center gap-1 text-xs mt-1">
					<TopPercentTag value={review.topPercent} />
					<GasimbiCategoryTag value={review.valueScore} />
				</div>

				<div className="text-xs text-grey-70 flex items-center">
					<Icon name={'Location'} size="xxs" /> {review.address} ·{' '}
					{review.distance}
				</div>
			</div>
		</div>
	);
}
