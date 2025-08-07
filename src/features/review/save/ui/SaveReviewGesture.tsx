'use client';

import { type ReactNode, useEffect, useState } from 'react';

import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

import { SaveReviewSheet } from '@/features/review/save/ui/SaveReviewSheet';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { ReviewId } from '@/shared/model/types';

interface SaveReviewGestureProps {
	children: ReactNode;
	reviewId: ReviewId;
}

const SWIPE_THRESHOLD = -100;

export const SaveReviewGesture = ({
	children,
	reviewId,
}: SaveReviewGestureProps) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-150, 0], [-15, 0]);
	const opacity = useTransform(x, [-120, 0], [0.5, 1]);
	const hintOpacity = useTransform(x, [-70, -50], [1, 0]);

	useEffect(() => {
		setIsSheetOpen(false);
		animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
	}, [reviewId, x]);

	const handleDragEnd = (
		_: unknown,
		info: { offset: { x: number; y: number } },
	) => {
		if (info.offset.x < SWIPE_THRESHOLD) {
			setIsSheetOpen(true);
		} else {
			animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
		}
	};

	return (
		<>
			<motion.div
				className="relative h-full w-full overflow-hidden"
				style={{ pointerEvents: isSheetOpen ? 'none' : 'auto' }}
			>
				<motion.div
					key={`card-${reviewId}`}
					className="h-full w-full origin-bottom-left cursor-grab active:cursor-grabbing"
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={{ left: 0.5, right: 0 }}
					style={{ x, rotate, opacity }}
					onDragEnd={handleDragEnd}
				>
					{children}
				</motion.div>

				<motion.div
					className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-white"
					style={{ opacity: hintOpacity }}
				>
					리뷰 저장하기
				</motion.div>
			</motion.div>

			<BottomSheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<BottomSheetOverlay className="fixed inset-0 z-40 bg-black/60" />
				<BottomSheetContent className="fixed bottom-0 z-50 w-full max-h-[80vh] rounded-t-2xl bg-white shadow-lg">
					<SaveReviewSheet
						reviewId={reviewId}
						onClose={() => setIsSheetOpen(false)}
					/>
				</BottomSheetContent>
			</BottomSheet>
		</>
	);
};
