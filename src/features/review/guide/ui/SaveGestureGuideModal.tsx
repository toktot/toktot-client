'use client';

import { motion } from 'framer-motion';

import Icon from '@/shared/ui/Icon';

interface SaveGestureGuideModalProps {
	onConfirm: () => void;
}

export const SaveGestureGuideModal = ({
	onConfirm,
}: SaveGestureGuideModalProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
		>
			<div className="flex w-80 h-96 flex-col justify-around items-center gap-4 rounded-3xl bg-white p-6 text-center relative">
				<Icon
					name="Cancel"
					size="xl"
					className="text-grey-50 top-2 absolute right-2"
					onClick={onConfirm}
				/>
				<h3 className="font-semibold">
					마음에 드는 리뷰를
					<br /> 손쉽게 저장해 보세요!
				</h3>
				<p className="text-sm text-grey-70">
					왼쪽에서 오른쪽으로 리뷰를 밀면
					<br />
					리뷰를 저장할 수 있어요
				</p>
			</div>
		</motion.div>
	);
};
