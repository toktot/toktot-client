'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';

import { useBlockUser } from '../model/useBlockUser';

interface BlockUserButtonProps {
	userId: number;
	nickname: string;
	className?: string;
	onSuccess?: () => void; // 차단 성공 시 추가 액션을 위한 콜백
}

export const BlockUserButton = ({
	userId,
	nickname,
	className,
	onSuccess,
}: BlockUserButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { blockUser, isLoading } = useBlockUser();

	const handleConfirm = async () => {
		const success = await blockUser(userId);
		if (success) {
			onSuccess?.();
		}
		setIsModalOpen(false);
	};

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				disabled={isLoading}
				className={className}
			>
				{isLoading ? '처리 중...' : '차단하기'}
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
