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
		distance: string;
		main_menus: string;
		average_rating: number;
		review_count: number;
		is_good_price_store: boolean;
		is_local_store: boolean;
		image: string;
		topPercent?: string;
		valueScore?: number;
	};
}

export default function NearCard({ review }: StoreInfoCardProps) {
	const router = useRouter();
	console.log(review.id);
	const hasImage = !!review.image;
	return (
		<div
			className=" flex flex-row gap-3 "
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative w-[89px] h-[89px]">
				{hasImage ? (
					<Image
						src={review.image as string}
						alt={`${review.name} 이미지`}
						fill
						className=" object-cover"
					/>
				) : (
					<div className="w-[89px] h-[89px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-xl">
						<div className="flex flex-col flex items-center">
							<span className="">
								<Icon name="KoreanDish" size="xl"></Icon>
							</span>
							<div className="text-[9px] text-grey-50 font-semibold flex items-center text-center">사진을 준비하고<br/> 있어요</div>
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

			<div className="flex flex-col justify-between flex-1">
				<div className="flex justify-between items-center text-sm text-grey-80">
					<div className="flex flex-wrap gap-2 mt-1">
						<span className="text-[16px] font-semibold">{review.name}</span>
						<div className="flex flex-wrap items-center text-sm text-grey-80">
							<div className="flex items-center text-sm text-grey-80 flex-shrink-0">
								<Icon name="Star" size="xs" className="mr-1" style={{fill : '#40D7F5', color:'#40D7F5'}}/>
								<span className="mr-1">{review.average_rating.toFixed(1)}</span>
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
						<GasimbiCategoryTag value={review.valueScore} />
					)}
				</div>

				<div className="text-xs text-grey-70 flex items-center mb-1">
					<Icon name={'Location'} size="xxs" /> {review.address} ·{' '}
					{review.distance}
				</div>
			</div>
		</div>
	);
}
