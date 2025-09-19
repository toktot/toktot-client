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
		mainMenu?: string | null;
		rating: number;
		distance?: string | null;
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
					<span className="text-[14px] font-semibold mb-0.5">
						{review.storeName}
					</span>
				</div>

				<div className="text-xs text-grey-70 flex items-center mb-1">
					{review.address}
				</div>
			</div>
			<div className="flex items-center">
				<Icon name="ArrowRight" className="text-grey-50" size="xs" />
			</div>
		</div>
	);
}
