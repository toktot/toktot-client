'use client';

import React from 'react';

import type { ReviewView } from '@/entities/review/model/view';

import { RelatedReviewsSheet } from '@/features/related-reviews/ui/RelatedReviewsSheet';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';

import { ReviewStatisticsWidget } from './ReviewStatisticsWidget';
import ReviewStore from './ReviewStore';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: ReviewView;
};

export const ReviewTooltipSheet = ({ open, onOpenChange, review }: Props) => {
	return (
		<BottomSheet open={open} onOpenChange={onOpenChange}>
			<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
			<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[80vh] rounded-t-2xl bg-white shadow-lg px-2 flex flex-col">
				<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />

				<div className="flex-shrink-0">
					<div className="bg-grey-10 rounded-xl">
						<ReviewStore storeId={review.store.id} />
					</div>
					<ReviewStatisticsWidget storeId={review.store.id} />
				</div>
				<div className="flex-1 min-h-0">
					<RelatedReviewsSheet storeId={review.store.id} />
				</div>
			</BottomSheetContent>
		</BottomSheet>
	);
};
