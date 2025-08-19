'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

import {
	isSubmitEnabled,
	useReportFormStore,
} from '../model/useReportFormStore';

const ConfirmModal = ({
	onClose,
	onConfirm,
}: {
	onClose: () => void;
	onConfirm: () => void;
}) => {
	const searchParams = useSearchParams();
	const nickname = searchParams.get('nickname') || '알 수 없는 사용자';

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
				<h2 className="text-lg font-bold mb-6">
					{`${nickname}님을 차단하시겠습니까?`}
				</h2>
				<div className="flex gap-3">
					<button onClick={onClose} className="flex-1 text-sm font-semibold">
						취소
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 text-sm font-semibold text-sub-red-30"
					>
						차단
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};

export const SubmitReportButton = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isEnabled = useReportFormStore(isSubmitEnabled);
	const isSubmitting = useReportFormStore((state) => state.isSubmitting);
	const submitReport = useReportFormStore((state) => state.submitReport);

	const handleConfirm = async () => {
		const success = await submitReport();
		if (success) {
			// TODO: 신고 완료 페이지로 이동하거나, 이전 페이지로 돌아가기
			alert('신고가 접수되었습니다.');
			router.back();
		}
		setIsModalOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				disabled={!isEnabled || isSubmitting}
				className="w-full py-3 text-lg font-semibold bg-grey-90 text-primary-40 rounded-[20px] disabled:bg-grey-50 disabled:text-white"
			>
				{isSubmitting ? '처리 중...' : '신고하기'}
			</button>

			<AnimatePresence>
				{isModalOpen && (
					<ConfirmModal
						onClose={() => setIsModalOpen(false)}
						onConfirm={handleConfirm}
					/>
				)}
			</AnimatePresence>
		</>
	);
};
