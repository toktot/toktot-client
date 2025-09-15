'use client';

import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';

import { useBlockUser } from '../model/useBlockUser';

interface BlockPostButtonProps {
	userId: number;
	className?: string;
	onSuccess?: () => void;
}

/**
 * 게시물을 차단하는 버튼입니다.
 * 현재 백엔드 이슈로 인해, 실제로는 `userId`를 사용하여 해당 게시물의 작성자를 차단합니다.
 *
 * @param {object} props - 컴포넌트 props
 * @param {number} props.userId - 차단할 사용자의 ID (게시물 작성자)
 * @param {string} [props.className] - 버튼에 적용될 CSS 클래스
 * @param {() => void} [props.onSuccess] - 차단 성공 시 호출될 콜백 함수
 */
export const BlockPostButton = ({
	userId,
	className,
	onSuccess,
}: BlockPostButtonProps) => {
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
						title={`해당 게시물을 차단하시겠습니까?`}
						confirmLabel="차단"
						cancelLabel="취소"
					/>
				)}
			</AnimatePresence>
		</>
	);
};
