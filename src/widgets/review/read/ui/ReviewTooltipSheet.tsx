'use client';

import React from 'react';

import type { ReviewView } from '@/entities/review/model/view';

import { RelatedReviewsSheet } from '@/features/related-reviews/ui/RelatedReviewsSheet';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review?: ReviewView | null;
};

export const ReviewTooltipSheet = ({ open, onOpenChange, review }: Props) => {
	return (
		<BottomSheet open={open} onOpenChange={onOpenChange}>
			<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
			<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] rounded-t-2xl bg-white shadow-lg">
				<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
				{review && (
					<RelatedReviewsSheet
						clickedReview={review}
						storeId={review.store.id}
					/>
				)}
			</BottomSheetContent>
		</BottomSheet>
	);
};
