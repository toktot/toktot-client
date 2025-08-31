'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

export interface SimpleStoreProps {
	review: {
		id: number;
		storeImageUrl: string;
		storeName: string;
		isKindStore?: boolean;
		mainMenus: string[];
		reviewCount: number;
		valueScore: number;
		topPercent: string;
		address: string;
		mainMenu?: string;
		rating: number;
		distance?: string;
	};
}

export default function SimpleStore({ review }: SimpleStoreProps) {
	const router = useRouter();
	return (
		<div
			className="flex items-center justify-between gap-3 p-3 b-border-1 bg-grey-10 w-full"
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative w-[40px] h-[40px]">
				<Image
					src={review.storeImageUrl}
					alt={`${review.storeName} 이미지`}
					fill
					className="block rounded-md object-cover"
				/>
			</div>

			<div className="flex flex-col justify-between flex-1">
				<div className="flex flex-wrap">
					<span className="text-[14px] font-semibold">{review.storeName}</span>
					<div className="flex items-center ml-2 text-sm text-grey-80">
						({review.mainMenu})
					</div>
				</div>

				<div className="text-xs text-grey-70 flex items-center">
					<Icon name={'Location'} size="xxs" /> {review.address} ·{' '}
					{review.distance}
				</div>
			</div>
			<div className="flex items-center">
				<Icon name="ArrowRight" className="text-grey-50" />
			</div>
		</div>
	);
}
