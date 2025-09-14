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

	return (
		<div
			className="flex flex-row gap-3 p-3 bg-white min-w-[343px] max-w-[430px] h-[105px] cursor-pointer"
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative w-[89px] h-[89px]">
				{review.image ? (
					<Image
						src={review.image as string}
						alt={`${review.name} 이미지`}
						fill
						className="object-cover"
					/>
				) : (
					<div className="bg-grey-10 rounded-xl w-[89px] h-[89px]"></div>
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

			<div className="flex flex-col justify-between flex-1 gap-2">
				<div className="flex justify-between items-center text-sm text-grey-80">
					<div className="flex flex-col">
						<span className="text-[16px] font-semibold">{review.name}</span>
						<div className="flex items-center text-sm text-grey-80 flex-shrink-0">
							<div className="flex flex-wrap items-center text-sm text-grey-80">
								<Icon name="Star" size="xs" className="text-yellow-500 mr-1" />
								<span className="mr-1">
									{review.average_rating?.toFixed(1)}
								</span>
								<span className="text-grey-90 mr-2">
									({review.review_count})
								</span>
							</div>
							{review.main_menus && (
								<span className="text-sm text-grey-80 truncate">
									{/* 메뉴 이름만 split 후 첫 번째만 보여주거나 원하는 개수만 */}
									{review.main_menus.split(' ')[0]}
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center text-xs mt-1">
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
