'use client';

import React, { useState } from 'react';

import { Tooltip } from '@/entities/review';
import { ReviewView } from '@/entities/review/model/view';
import { AnimatePresence, motion } from 'framer-motion';

import { InteractionGuide } from '@/features/review/guide/ui/InteractionGuide';
import { ImagePaginator } from '@/features/review/pagenate-images/ui/ImagePaginator';
import { useReviewPagination } from '@/features/review/read/lib/useImagePagination';

import {
	MoodKeywordId,
	ReviewId,
	ReviewImageId,
	StoreId,
	TooltipId,
	UserId,
} from '@/shared/model/types';

import { InteractiveReview } from './InteractiveReview';
import ReviewStore from './ReviewStore';
import { ReviewTooltipSheet } from './ReviewTooltipSheet';
import ReviewUser from './ReviewUser';

export const mockReview1: ReviewView = {
	id: '1' as ReviewId,
	author: {
		id: 1 as UserId,
		username: 'food91',
		password: 'securepassword',
		nickname: '정현',
	},
	store: {
		id: 'store-001' as StoreId,
		storeName: '맛있는김밥천국',
		mainMenu: '참치김밥',
		address: '서울특별시 강남구 테헤란로 123',
		storeImageUrl: '/images/store1.png',
	},
	createdAt: '2025-07-25T14:00:00.000Z',
	images: [
		{
			id: 'img-001' as ReviewImageId,
			url: '/images/mockReview.jpg',
			tooltipIds: ['t1' as TooltipId, 't2' as TooltipId, 't3' as TooltipId],
		},
		{
			id: 'img-002' as ReviewImageId,
			url: '/images/review1.png',
			tooltipIds: ['t3' as TooltipId],
		},
		{
			id: 'img-003' as ReviewImageId,
			url: '/images/review3.jpg',
			tooltipIds: [],
		},
	],
	tooltips: {
		['t1' as TooltipId]: {
			id: 't1' as TooltipId,
			x: 20,
			y: 80,
			category: 'food',
			rating: 4,
			menuName: '참치김밥',
			price: 3500,
			description: '참치가 많이 들어가서 맛있었어요.',
		},
		['t2' as TooltipId]: {
			id: 't2' as TooltipId,
			x: 40,
			y: 30,
			category: 'service',
			rating: 5,
			description: '직원분이 정말 친절했어요.',
		},
		['t3' as TooltipId]: {
			id: 't2' as TooltipId,
			x: 53.17647058823529,
			y: 10,
			category: 'clean',
			rating: 5,
			description: '직원분이 정말 친절했어요.',
		},
	},
	moodKeywords: [
		{ id: 1 as MoodKeywordId, label: '가성비 좋아요' },
		{ id: 2 as MoodKeywordId, label: '혼밥하기 좋아요' },
	],
};
export const mockReview2: ReviewView = {
	id: '2' as ReviewId,
	author: {
		id: 2 as UserId,
		username: 'cleane22',
		password: 'anotherpassword',
		nickname: '지우',
	},
	store: {
		id: 'store-002' as StoreId,
		storeName: '청결한국밥집',
		mainMenu: '순대국밥',
		address: '부산광역시 수영구 광안해변로 456',
		storeImageUrl: '/images/store2.png',
	},
	createdAt: '2025-07-26T11:20:00.000Z',
	images: [
		{
			id: 'img-002' as ReviewImageId,
			url: '/images/mockReview.jpg',
			tooltipIds: ['t3' as TooltipId],
		},
	],
	tooltips: {
		['t3' as TooltipId]: {
			id: 't3' as TooltipId,
			x: 90,
			y: 40,
			category: 'clean',
			rating: 5,
			description: '테이블과 식기가 정말 깔끔했어요.',
		},
	},
	moodKeywords: [
		{ id: 3 as MoodKeywordId, label: '가족과 함께 좋아요' },
		{ id: 4 as MoodKeywordId, label: '청결해요' },
	],
};

// 스와이프 강도를 계산하기 위한 상수
const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity;
};

// 슬라이드 애니메이션을 위한 variants
const variants = {
	enter: (direction: number) => ({
		y: direction > 0 ? '100%' : '-100%',
		opacity: 0,
	}),
	center: {
		zIndex: 1,
		y: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		y: direction < 0 ? '100%' : '-100%',
		opacity: 0,
	}),
};

export function ReviewStoryFeed() {
	const data = [mockReview1, mockReview2];
	const { page, direction, paginate } = useReviewPagination(0, data.length);
	const currentIndex = page;

	const [showGuide, setShowGuide] = useState(true);

	const [selectedReview, setSelectedReview] = useState<ReviewView | null>(null);

	const handleTooltipClick = (tooltip: Tooltip) => {
		console.log('🚀 ~ handleTooltipClick ~ tooltip:', tooltip);
		setSelectedReview(currentPost);
	};

	const currentPost = data[currentIndex];

	return (
		<div className="relative flex flex-col h-full">
			<AnimatePresence initial={false} custom={direction}>
				<motion.div
					className="absolute h-full w-full"
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
					// --- 상/하 스와이프 로직 ---
					drag="y"
					dragConstraints={{ top: 0, bottom: 0 }}
					dragElastic={1}
					onDragEnd={(e, { offset, velocity }) => {
						const swipe = swipePower(offset.y, velocity.y);

						if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
							paginate(1); // 위로 스와이프 -> 다음 리뷰
						} else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
							paginate(-1); // 아래로 스와이프 -> 이전 리뷰
						}
					}}
				>
					<div className="relative flex flex-col h-full bg-red-200">
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
								/>
							</InteractiveReview>
						</div>
						<div className="h-[140px] p-4 text-grey-10 bg-black flex flex-col gap-[14px]">
							<ReviewUser
								author={currentPost.author}
								extra={{ totalReviewCount: 200, averageRating: 300 }}
							/>
							<div className="bg-grey-90 rounded-xl">
								<ReviewStore
									store={currentPost.store}
									extra={{ distance: 200 }}
								/>
							</div>
						</div>
					</div>
				</motion.div>

				<ReviewTooltipSheet
					open={!!selectedReview}
					onOpenChange={(o) => !o && setSelectedReview(null)}
					review={selectedReview}
				/>
			</AnimatePresence>
		</div>
	);
}
