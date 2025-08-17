'use client';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

interface StoreInfoCardProps {
	review: {
		id: string;
		storeImageUrl: string;
		storeName: string;
		isKindStore?: boolean;
		mainMenu: string;
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
			<Image
				src={review.storeImageUrl}
				alt={`${review.storeName} 이미지`}
				width={85}
				height={85}
				className="rounded-md object-cover"
			/>
			<div className="flex flex-col justify-between">
				<div className="flex items-center gap-2">
					<span className="text-[16px] font-semibold">{review.storeName}</span>
					{review.isKindStore && (
						<StoreCategoryTag
							className="text-[9px] text-green-700 bg-green-100"
							type="착한가게"
						/>
					)}
				</div>

				<div className="flex items-center mb-3">
					<span className="text-grey-70 text-[13px] mr-2">
						{review.mainMenu}
					</span>
					<Icon name={'Star'} size="xxs" className="text-yellow-500 mr-1" />
					{review.rating.toFixed(1)}
				</div>
				<div className="text-xs text-grey-70 flex items-center">
					<Icon name={'Location'} size="xxs" /> {review.address} ·{' '}
					{review.distance}
				</div>
			</div>
		</div>
	);
}
