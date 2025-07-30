'use client';

import React, { useState } from 'react';

import { Tooltip } from '@/entities/review';
import { ReviewView } from '@/entities/review/model/view';
import { ReviewStory } from '@/entities/review/ui/ReviewStory';
import { AnimatePresence, motion } from 'framer-motion';

import { InteractionGuide } from '@/features/review/guide/ui/InteractionGuide';
import { ImagePaginator } from '@/features/review/pagenate-images/ui/ImagePaginator';

import {
	MoodKeywordId,
	ReviewId,
	ReviewImageId,
	StoreId,
	TooltipId,
	UserId,
} from '@/shared/model/types';

export const mockReview1: ReviewView = {
	id: 'review-001' as ReviewId,
	author: {
		id: 1 as UserId,
		username: 'food91',
		password: 'securepassword',
		name: '정현',
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
			url: '/images/review1.png',
			tooltipIds: ['t1' as TooltipId, 't2' as TooltipId],
		},
		{
			id: 'img-002' as ReviewImageId,
			url: '/images/mockReview.jpg',
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
	},
	moodKeywords: [
		{ id: 1 as MoodKeywordId, label: '가성비 좋아요' },
		{ id: 2 as MoodKeywordId, label: '혼밥하기 좋아요' },
	],
};
export const mockReview2: ReviewView = {
	id: 'review-002' as ReviewId,
	author: {
		id: 2 as UserId,
		username: 'cleane22',
		password: 'anotherpassword',
		name: '지우',
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

// 애니메이션 방향과 페이지 인덱스를 함께 관리하기 위한 타입
type PageState = [number, number]; // [page, direction]

export function ReviewStoryFeed() {
	const data = [mockReview1, mockReview2];
	const [[page, direction], setPage] = useState<PageState>([0, 0]);
	const currentIndex = page;
	const [showGuide, setShowGuide] = useState(true);

	// if (isLoading) {
	// 	return (
	// 		<div className="flex h-screen w-screen items-center justify-center bg-black text-white">
	// 			Loading...
	// 		</div>
	// 	);
	// }
	// if (!data.length) {
	// 	return (
	// 		<div className="flex h-screen w-screen items-center justify-center bg-black text-white">
	// 			No reviews found.
	// 		</div>
	// 	);
	// }

	const paginate = (newDirection: number) => {
		const newIndex = page + newDirection;
		if (newIndex < 0 || newIndex >= data.length) {
			return;
		}

		setPage([newIndex, newDirection]);
	};

	const currentPost = data[currentIndex];

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

	const handleTooltipClick = (tooltip: Tooltip) => {
		console.log('🚀 ~ handleTooltipClick ~ tooltip:', tooltip);

		// TODO: 리뷰 리스트 바텀시트 오픈
	};

	return (
		<div className="relative h-screen w-screen overflow-hidden bg-black">
			<AnimatePresence>
				{showGuide && <InteractionGuide onClose={() => setShowGuide(false)} />}
			</AnimatePresence>
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
					<ReviewStory
						post={currentPost}
						infoLayer={
							<div
								className="p-4 text-white"
								style={{
									background:
										'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
								}}
							>
								<p className="font-bold">{currentPost.author.name}</p>
								<p className="text-sm">{currentPost.store.storeName}</p>
							</div>
						}
						interactiveLayer={
							<ImagePaginator
								images={currentPost.images}
								tooltips={currentPost.tooltips}
								onTooltipClick={handleTooltipClick}
							/>
						}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
