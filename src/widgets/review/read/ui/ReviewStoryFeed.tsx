'use client';

import React, { useState } from 'react';

import { Tooltip } from '@/entities/review';
import { mapReviewContentToView } from '@/entities/review/api/mappers';
import { AnimatePresence, motion } from 'framer-motion';

import { InteractionGuide } from '@/features/review/guide/ui/InteractionGuide';
import { ImagePaginator } from '@/features/review/pagenate-images/ui/ImagePaginator';
import { useInfiniteReviewFeed } from '@/features/review/read/hooks/useInfiniteReviewFeed';
import { useReviewPagination } from '@/features/review/read/lib/useImagePagination';

import { InteractiveReview } from './InteractiveReview';
import ReviewStore from './ReviewStore';
import { ReviewStoreWithSheet } from './ReviewStoreWithSheet';
import ReviewUser from './ReviewUser';

// 스와이프 강도를 계산하기 위한 상수
const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity;
};
// 슬라이드 애니메이션을 위한 variants
const variants = {
	enter: (direction: number) => ({
		y: direction > 0 ? '100%' : '-100%',
	}),
	center: {
		zIndex: 1,
		y: 0,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		y: direction < 0 ? '100%' : '-100%',
	}),
};

export function ReviewStoryFeed() {
	const { data: reviewsData, fetchNextPage } = useInfiniteReviewFeed({});
	const reviews = reviewsData.map(mapReviewContentToView);

	const { page, direction, paginate } = useReviewPagination(0, reviews.length);
	const currentIndex = page;

	const [showGuide, setShowGuide] = useState(true);

	const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);

	const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

	const handleTooltipClick = (tooltip: Tooltip) => {
		setSelectedTooltip((prev) => (prev?.id === tooltip.id ? null : tooltip));
	};

	const currentPost = reviews[currentIndex];

	if (!currentPost) {
		return <div>리뷰를 불러오는 중...</div>;
	}

	return (
		<AnimatePresence initial={false} custom={direction}>
			<motion.div
				className="h-full overflow-x-hidden"
				key={page} // page(currentIndex)가 바뀔 때마다 AnimatePresence가 작동합니다.
				custom={direction}
				variants={variants}
				initial="enter"
				animate="center"
				exit="exit"
				transition={{
					y: { type: 'spring', stiffness: 300, damping: 30 },
					opacity: { duration: 0.2 },
				}}
				drag="y"
				dragConstraints={{ top: 0, bottom: 0 }}
				dragElastic={1}
				onDragEnd={(e, { offset, velocity }) => {
					const swipe = swipePower(offset.y, velocity.y);

					if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
						paginate(1);
					} else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
						paginate(-1);
					}

					if (currentIndex === reviews.length - 2) {
						fetchNextPage();
					}
				}}
			>
				<div className="relative flex flex-col h-full">
					<div className="flex-1 relative">
						<InteractiveReview reviewId={currentPost.id}>
							<AnimatePresence>
								{showGuide && (
									<InteractionGuide onClose={() => setShowGuide(false)} />
								)}
							</AnimatePresence>
							<ImagePaginator
								images={currentPost.images}
								tooltips={currentPost.tooltips}
								onTooltipClick={handleTooltipClick}
								selectTooltip={selectedTooltip}
								onOpenSheet={() => setIsSheetOpen(true)}
							/>
						</InteractiveReview>
					</div>
					<div className="h-[140px] p-4 text-grey-10 bg-black flex flex-col gap-[14px]">
						<div className="flex-shrink-0">
							<ReviewUser author={currentPost.author} />
						</div>

						<div className="flex gap-2">
							<div className="bg-grey-90 rounded-xl flex-[4] min-w-0">
								<ReviewStore storeId={currentPost.store.id} />
							</div>
							<div className="bg-grey-90 rounded-xl flex-[1.3] min-w-0">
								<ReviewStoreWithSheet
									review={currentPost}
									isSheetOpen={isSheetOpen}
									onSheetOpenChange={setIsSheetOpen}
								/>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
