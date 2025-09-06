'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import {
	isUserReportSubmitEnabled,
	useUserReportStore,
} from '../../model/useUserReportStore';
import { ConfirmModal } from '../../ui/ConfirmModal';

export const SubmitUserReportButton = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const nickname = searchParams.get('nickname') || '알 수 없는 사용자';

	const [isModalOpen, setIsModalOpen] = useState(false);

	const isEnabled = useUserReportStore(isUserReportSubmitEnabled);
	const isSubmitting = useUserReportStore((state) => state.isSubmitting);
	const submit = useUserReportStore((state) => state.submit);

	const handleConfirm = async () => {
		const success = await submit();
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
						title={`${nickname}님을 차단하시겠습니까?`}
						confirmLabel="차단"
						cancelLabel="취소"
					/>
				)}
			</AnimatePresence>
		</>
	);
};
