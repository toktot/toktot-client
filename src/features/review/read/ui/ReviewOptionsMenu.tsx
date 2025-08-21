'use client';

import { useState } from 'react';

import { ReportReviewButton } from '@/features/report/review/ui/ReportReviewButton';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { ReviewId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

export const ReviewOptionsMenu = ({ reveiwId }: { reveiwId: ReviewId }) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<>
			<button onClick={() => setIsSheetOpen(true)}>
				<Icon name={'Kebab'} className="text-white" />
			</button>

			<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[460px] min-h-40 rounded-t-2xl bg-white shadow-lg px-4">
					<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
					<ReportReviewButton
						reviewId={Number(reveiwId)}
						snippet={'리뷰 내용'}
						className="w-full px-5 py-4 rounded-3xl border border-grey-20 text-left font-semibold"
					/>
					{/* TODO: 차단하기 추가 */}
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
};
