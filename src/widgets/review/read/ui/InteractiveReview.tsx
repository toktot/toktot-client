'use client';

import { useState } from 'react';

import { SaveReviewSheet } from '@/features/review/save/ui/SaveReviewSheet';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { ReviewId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

export const InteractiveReview = ({
	reviewId,
	isBookmarked,
	children,
}: {
	reviewId: ReviewId;
	isBookmarked: boolean;
	children: React.ReactNode;
}) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const openSheet = () => setIsSheetOpen(true);
	const closeSheet = () => setIsSheetOpen(false);

	return (
		<div className="relative h-full w-full">
			{children}

			<div className="absolute -bottom-17 right-3 z-10">
				<button
					onClick={openSheet}
					className="p-2 rounded-full  text-white flex flex-col items-center gap-1"
					aria-label="리뷰 저장하기"
				>
					<Icon
						name={'Bookmark'}
						className={isBookmarked ? 'fill-white' : ''}
					/>
					<span className="text-xs text-grey-30">저장</span>
				</button>
			</div>

			<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] rounded-t-2xl bg-white shadow-lg">
					<SaveReviewSheet reviewId={reviewId} onClose={closeSheet} />
				</BottomSheetContent>
			</BottomSheet>
		</div>
	);
};
