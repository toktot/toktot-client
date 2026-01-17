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

export default function AlarmComponent({ review }: SimpleStoreProps) {
	const router = useRouter();
	const menuName = review.mainMenu || review.mainMenus?.[0] || null;
	return (
		<div
			className="sm:w-[350px] min-w-[283px] flex items-center justify-between gap-3 px-4 py-1 ml-5 b-border-1 bg-grey-10 w-full rounded-xl"
			onClick={() => router.push(`/storemenu/${review.id}`)}
		>
			<div className="relative w-[40px] h-[40px] flex items-center justify-center bg-grey-20 rounded-md overflow-hidden">
				{review.storeImageUrl ? (
					<Image
						src={review.storeImageUrl}
						alt={`${review.storeName} 이미지`}
						fill
						className="block object-cover"
					/>
				) : (
					<Icon name="KoreanDish" className="text-grey-50" />
				)}
			</div>

			<div className="flex flex-col justify-between flex-1">
				<div className="flex flex-wrap gap-2">
					<span className="text-[14px] font-semibold mb-0">
						{review.storeName}
					</span>
					{menuName && (
						<span className="text-[13px] text-grey-60">(({menuName}))</span>
					)}
				</div>

				<div className="text-[12px] text-grey-70 flex items-center mb-0">
					{review.address}
				</div>
			</div>
			<div className="flex items-center">
				<Icon name="ArrowRight" className="text-grey-50" size="xxs"/>
			</div>
		</div>
	);
}
