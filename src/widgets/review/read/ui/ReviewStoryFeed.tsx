'use client';

import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { InteractionGuide } from '@/features/review/guide/ui/InteractionGuide';
import { ImagePaginator } from '@/features/review/pagenate-images/ui/ImagePaginator';
import { useReviewStoryFeedController } from '@/features/review/view-story-feed/model/useReviewStoryFeedController';
import { SortBottomSheet } from '@/features/review/sort/ui/SortBottomSheet';
import Icon from '@/shared/ui/Icon';

import { InteractiveReview } from './InteractiveReview';
import ReviewStore from './ReviewStore';
import { ReviewStoreWithSheet } from './ReviewStoreWithSheet';
import ReviewUser from './ReviewUser';

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity;
};

const variants = {
	enter: (direction: number) => ({
		y: direction > 0 ? '100%' : '-100%',
		position: 'absolute',
	}),
	center: { y: 0, position: 'absolute' },
	exit: (direction: number) => ({
		y: direction < 0 ? '100%' : '-100%',
		position: 'absolute',
	}),
};

export function ReviewStoryFeed() {
  const { states, handlers } = useReviewStoryFeedController();
  const {
    reviews,
    currentPost,
    currentIndex,
    direction,
    showGuide,
    selectedTooltip,
    isSheetOpen,
    isSortSheetOpen,
    currentSortOption,
    sort,
  } = states;
  const {
    paginate,
    fetchNextPage,
    setShowGuide,
    handleTooltipClick,
    setIsSheetOpen,
    setIsSortSheetOpen,
    handleSortChange,
  } = handlers;

	if (!currentPost && reviews.length === 0) {
		return <div className="relative h-full overflow-hidden bg-black"></div>;
	}
	if (!currentPost) {
		return null;
	}

	return (
		<div className="relative h-full overflow-hidden bg-black">
			<div className="absolute top-0 left-0  z-20 px-2 flex justify-end items-center">
				<button
					onClick={() => setIsSortSheetOpen(true)}
					className="flex items-center gap-1 text-blalck backdrop-blur-sm py-1 px-[10px] rounded-full bg-white"
				>
					<Icon name="Sort" size="xs" />
					<span className="text-sm font-medium">{currentSortOption?.label}</span>
				</button>
			</div>
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					className="h-full overflow-x-hidden w-full"
					key={currentIndex}
					custom={direction}
					variants={variants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{ duration: 0.3, ease: 'easeOut' }}
					drag="y"
					dragConstraints={{ top: 0, bottom: 0 }}
					dragElastic={0.05}
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
							<InteractiveReview
								reviewId={currentPost.id}
								isBookmarked={currentPost.isBookmarked}
							>
								<AnimatePresence>
									{showGuide && <InteractionGuide onClose={() => setShowGuide(false)} />}
								</AnimatePresence>
								<ImagePaginator
									post={currentPost}
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
			<SortBottomSheet
				isOpen={isSortSheetOpen}
				onOpenChange={setIsSortSheetOpen}
				currentSort={sort}
				onSortChange={handleSortChange}
			/>
		</div>
	);
}