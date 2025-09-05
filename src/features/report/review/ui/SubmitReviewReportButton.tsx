'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	isReviewReportSubmitEnabled,
	useReviewReportStore,
} from '../../model/useReviewReportStore';
import { ConfirmModal } from '../../ui/ConfirmModal';

export const SubmitReviewReportButton = () => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const isEnabled = useReviewReportStore(isReviewReportSubmitEnabled);
	const isSubmitting = useReviewReportStore((state) => state.isSubmitting);
	const submitReport = useReviewReportStore((state) => state.submitReport);

	const handleConfirm = async () => {
		const success = await submitReport();
		if (success) {
			toast.success('신고가 접수되었습니다.');
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
						title="게시물를 차단하시겠습니까?"
						confirmLabel="차단"
						cancelLabel="취소"
					/>
				)}
			</AnimatePresence>
		</>
	);
};
