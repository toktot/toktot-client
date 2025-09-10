'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import { useBottomSheet } from './BottomSheet';

interface PeekableBottomSheetContentProps {
	children: ReactNode;
	peekHeight: number; // 처음 보이는 높이(px)
	fullHeight: number; // 전체 확장 높이(px)
}

export const PeekableBottomSheetContent = ({
	children,
	peekHeight,
	fullHeight,
}: PeekableBottomSheetContentProps) => {
	const { isOpen, close, contentRef } = useBottomSheet();
	const [mode, setMode] = useState<'peek' | 'full'>('peek');
	const [vh, setVh] = useState(0);

	// viewport 높이 추적
	useEffect(() => {
		const update = () => setVh(window.innerHeight);
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	// Reset mode to 'peek' whenever bottom sheet opens
	useEffect(() => {
		if (isOpen) {
			setMode('peek');
		}
	}, [isOpen]);

	if (!isOpen || typeof document === 'undefined') return null;

	// 뷰포트 안으로 높이 클램프
	const clampedPeek = Math.min(peekHeight, vh);
	const clampedFull = Math.min(fullHeight, vh);

	// top:0 기준 translateY(px) 타깃
	const targetY = mode === 'peek' ? vh - clampedPeek : vh - clampedFull;

	const handleDragEnd = (
		_event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	) => {
		// 아래로 많이 끌면 닫기
		if (info.offset.y > 10 || info.velocity.y > 800) {
			close();
			return;
		}
		// 위로 충분히 끌면 확장, 아니면 피크
		if (info.offset.y < -60 || info.velocity.y < -10) {
			setMode('full');
		} else {
			setMode('peek');
		}
	};

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={contentRef}
					role="dialog"
					aria-modal="true"
					// viewport 기준 고정 포지셔닝

					className={twMerge(
						'fixed bottom-0 max-h-[90vh] left-0 right-0 z-50 rounded-t-2xl bg-white shadow-lg lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-[480px]',
					)}
					style={
						mode === 'peek'
							? { top: 0, height: clampedPeek }
							: { top: 0, height: 'auto', maxHeight: clampedFull }
					}
					// translateY는 px만 사용
					initial={{ y: vh || 10000 }}
					animate={{ y: targetY }}
					exit={{ y: vh || 10000 }}
					transition={{ type: 'spring', damping: 32, stiffness: 340 }}
					drag="y"
					dragMomentum={false}
					onDragEnd={handleDragEnd}
				>
					{/* 드래그 핸들 */}
					<div className="mx-auto my-3 h-1 w-6 rounded-full bg-grey-30" />
					{/* 스크롤은 내부에서 */}
					<div className="h-[calc(100%-20px)]">{children}</div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
};
