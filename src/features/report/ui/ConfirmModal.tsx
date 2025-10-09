'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const ConfirmModal = ({
	onClose,
	onConfirm,
	title,
	children,
	confirmLabel = '확인',
	cancelLabel = '취소',
}: {
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	children?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
			onClick={onClose} // 배경 클릭 시 닫기
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-2xl px-4 py-[18px] w-full max-w-sm "
				onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 전파 방지
			>
				<h2 className="text-lg font-bold mb-4 text-center">{title}</h2>
				{children}
				<div className="flex gap-3 mt-6">
					<button
						onClick={onClose}
						className="flex-1 py-3 text-sm font-semibold bg-grey-20 rounded-lg"
					>
						{cancelLabel}
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-3 text-sm font-semibold text-white bg-sub-red-30 rounded-lg"
					>
						{confirmLabel}
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};
