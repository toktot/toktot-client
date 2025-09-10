'use client';

import Image from 'next/image';

import Icon from '@/shared/ui/Icon';

import { SavedReview } from '../api/schema';

interface SavedReviewCardProps {
	review: SavedReview;
	onDelete?: (reviewId: number) => void; // 추후 삭제 기능 구현을 위함
}

export const SavedReviewCard = ({ review, onDelete }: SavedReviewCardProps) => {
	return (
		<div className="relative w-full h-[30vh] rounded-lg overflow-hidden shadow-md">
			{review.mainImageUrl ? (
				<Image
					src={review.mainImageUrl}
					alt={`${review.restaurant.name} 리뷰 이미지`}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
				/>
			) : (
				<div className="w-full h-full bg-grey-100 flex items-center justify-center">
					<Icon name="Logo" className="text-grey-300" size="l" />
				</div>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

			{/* 삭제 예정 버튼 (메뉴) */}
			<div className="absolute top-2 right-2">
				<button
					onClick={() => onDelete?.(review.id)}
					className="p-1 rounded-full bg-black/30 text-white hover:bg-black/60"
					aria-label="메뉴"
				>
					<Icon name="Kebab" size="s" />
				</button>
			</div>

			<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
				<h3 className="font-bold text-base truncate">
					{review.restaurant.name}
				</h3>
				<p className="text-xs text-grey-200 truncate">
					{review.restaurant.address}
				</p>
			</div>
		</div>
	);
};
