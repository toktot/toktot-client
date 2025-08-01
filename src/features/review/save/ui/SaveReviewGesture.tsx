'use client';

import { type ReactNode, useEffect, useState } from 'react';

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useTransform,
} from 'framer-motion';

import { ReviewId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

import { useSaveReview } from '../lib/useSaveReview';

interface SaveReviewGestureProps {
	children: ReactNode;
	reviewId: ReviewId;
}

const SWIPE_THRESHOLD = -100;

export const SaveReviewGesture = ({
	children,
	reviewId,
}: SaveReviewGestureProps) => {
	const [isSaved, setIsSaved] = useState(false);
	const { mutate: saveReview, isPending } = useSaveReview();

	// 드래그 상태를 Motion Value로 관리
	const x = useMotionValue(0);

	// Motion Value의 변화에 따라 다른 값을 동적으로 계산
	const rotate = useTransform(x, [-150, 0], [-15, 0]); // x가 -150px일 때 -15도 회전
	const opacity = useTransform(x, [-120, 0], [0.5, 1]); // x가 -120px일 때 투명도 0.5
	const hintOpacity = useTransform(x, [-50, -70], [0, 1]); // 힌트 텍스트의 투명도

	// 리뷰가 바뀔 때마다 상태 초기화
	useEffect(() => {
		setIsSaved(false);
		x.set(0); // Motion Value 초기화
	}, [reviewId, x]);

	// onDragEnd 핸들러로 드래그 종료 시 로직 처리
	const handleDragEnd = (
		_: unknown,
		info: { offset: { x: number; y: number } },
	) => {
		if (info.offset.x < SWIPE_THRESHOLD && !isPending && !isSaved) {
			saveReview(reviewId);
			setIsSaved(true);
		}
	};

	return (
		<div className="relative h-full w-full overflow-hidden">
			<AnimatePresence>
				{!isSaved ? (
					// --- 드래그 가능한 카드 ---
					<motion.div
						key={`card-${reviewId}`}
						className="h-full w-full origin-bottom-left cursor-grab active:cursor-grabbing"
						// 4. Framer Motion의 드래그 기능 사용
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={{ left: 0.5, right: 0 }}
						style={{ x, rotate, opacity }} // Motion Value를 직접 스타일에 연결
						onDragEnd={handleDragEnd}
						exit={{
							x: '-150%',
							rotate: -30,
							opacity: 0,
							transition: { duration: 0.5 },
						}}
					>
						{children}
					</motion.div>
				) : (
					// --- 저장 완료 UI ---
					<motion.div
						key={`saved-${reviewId}`}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/50"
					>
						<Icon name="Bookmark" size="xxl" className="text-primary-40" />
						<span className="font-bold text-white">저장됨</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 드래그 힌트 UI */}
			<motion.div
				className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-white"
				style={{ opacity: hintOpacity }} // 힌트 투명도 연결
			>
				리뷰 저장하기
			</motion.div>
		</div>
	);
};
