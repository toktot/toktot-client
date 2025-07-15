'use client';

import React, {
	Children,
	type ReactNode,
	cloneElement,
	createContext,
	isValidElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
	AnimatePresence,
	type HTMLMotionProps,
	type PanInfo,
	motion,
} from 'framer-motion';

interface BottomSheetContextProps {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	contentRef: React.RefObject<HTMLDivElement | null>;
}

const BottomSheetContext = createContext<BottomSheetContextProps | null>(null);

const useBottomSheet = () => {
	const context = useContext(BottomSheetContext);
	if (!context) {
		throw new Error('useBottomSheet must be used within a BottomSheet');
	}
	return context;
};

interface BottomSheetProps {
	children: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export const BottomSheet = ({
	children,
	open: controlledOpen,
	onOpenChange,
}: BottomSheetProps) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	const isOpen = controlledOpen ?? internalOpen;
	const setIsOpen = onOpenChange ?? setInternalOpen;

	const open = () => setIsOpen(true);
	const close = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<BottomSheetContext.Provider value={{ isOpen, open, close, contentRef }}>
			{children}
		</BottomSheetContext.Provider>
	);
};

export const BottomSheetTrigger = ({ children }: { children: ReactNode }) => {
	const { open } = useBottomSheet();
	const child = Children.only(children);

	if (!isValidElement(child)) {
		return null;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const originalOnClick = (child.props as any).onClick;

	return cloneElement(
		child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
		{
			onClick: (e: React.MouseEvent<HTMLElement>) => {
				open();
				// 자식에게 원래 onClick이 함수 형태로 존재할 경우에만 실행
				if (typeof originalOnClick === 'function') {
					originalOnClick(e);
				}
			},
		},
	);
};

export const BottomSheetOverlay = (props: HTMLMotionProps<'div'>) => {
	const { isOpen, close } = useBottomSheet();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={close}
					{...props}
				/>
			)}
		</AnimatePresence>,
		document.body,
	);
};

interface BottomSheetContentProps extends HTMLMotionProps<'div'> {
	children: ReactNode;
}

export const BottomSheetContent = ({
	children,
	...props
}: BottomSheetContentProps) => {
	const { isOpen, close, contentRef } = useBottomSheet();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	) => {
		const dragThreshold = 150; // 드래그 임계값 (px)

		if (info.offset.y > dragThreshold) {
			close();
		}
	};

	if (!isMounted) {
		return null;
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={contentRef}
					role="dialog"
					aria-modal="true"
					// 애니메이션 설정
					initial={{ y: '100%' }}
					animate={{ y: '0%' }}
					exit={{ y: '100%' }}
					transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					// 드래그 설정
					drag="y"
					dragConstraints={{ top: 0, bottom: 0 }}
					dragElastic={{ top: 0, bottom: 0.5 }}
					onDragEnd={handleDragEnd}
					{...props}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
};
