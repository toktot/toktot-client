'use client';

import { motion } from 'framer-motion';

export const ConfirmModal = ({
	onClose,
	onConfirm,
	title,
	confirmLabel = '확인',
	cancelLabel = '취소',
}: {
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	confirmLabel?: string;
	cancelLabel?: string;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-2xl px-4 py-[18px] w-full max-w-sm "
			>
				<h2 className="text-lg font-bold mb-6">{title}</h2>
				<div className="flex gap-3">
					<button onClick={onClose} className="flex-1 text-sm font-semibold">
						{cancelLabel}
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 text-sm font-semibold text-sub-red-30"
					>
						{confirmLabel}
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};
