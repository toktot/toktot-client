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
		name: string;
		address: string;
		distance: string | null;
		main_menus?: string | null;
		average_rating?: number | null;
		review_count?: number | null;
		is_good_price_store?: boolean | null;
		is_local_store?: boolean | null;
		image?: string | null;
		topPercent?: string | null;
		valueScore?: number | null;
	};
}

export default function StoreInfoCard({ review }: StoreInfoCardProps) {
	const router = useRouter();
	console.log(review.id);
	const hasImage = !!review.image;
	return (
		<div
			className="shadow-md rounded-xl flex flex-col gap-3 b-border-1 bg-white max-w-[430px] min-w-[343px]"
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative max-w-[430px] min-w-[343px] h-[100px]">
				{hasImage ? (
					<Image
						src={review.image as string}
						alt={`${review.name} 이미지`}
						fill
						className="object-cover"
					/>
				) : (
					<div className="max-w-[430px] min-w-[343x] h-[122px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-t-xl">
						사진을 준비하고 있어요
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

			<div className="p-3 flex flex-col gap-2">
				<div className="flex items-center text-sm text-grey-80">
					<div className="flex items-center gap-2">
						<span className="text-[16px] font-semibold">{review.name}</span>
						{review.main_menus && (
							<span className="text-sm text-grey-80 truncate">
								{/* 메뉴 이름만 split 후 첫 번째만 보여주거나 원하는 개수만 */}
								{review.main_menus.split(' ')[0]}
							</span>
						)}
					</div>
					<div className="flex items-center text-sm text-grey-80 flex-shrink-0">
						<Icon name="Star" size="xs" className="text-yellow-500 mr-1" />
						<span className="mr-1">{review.average_rating?.toFixed(1)}</span>
					</div>
					<span className="text-grey-90 mr-2">({review.review_count})</span>
				</div>
				<div className="flex items-center text-xs mt-1">
					<div className="text-[16px] -mt-2 text-grey-90 truncate">
						{review.main_menus}
					</div>
					{review.topPercent && <TopPercentTag value={review.topPercent} />}
					{review.valueScore !== undefined && (
						<GasimbiCategoryTag value={review.valueScore ?? 0} />
					)}
				</div>

				<div className="text-xs text-grey-70 flex items-center">
					<Icon name={'Location'} size="xxs" /> {review.address} ·{' '}
					{review.distance}
				</div>
			</div>
		</div>
	);
}
