'use client';

import { AnimatePresence } from 'framer-motion';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';

import { useLogout } from '../model/useLogout';

export const LogoutButton = () => {
	const {
		isModalOpen,
		openLogoutModal,
		closeLogoutModal,
		handleConfirmLogout,
	} = useLogout();

	return (
		<>
			<button
				onClick={openLogoutModal}
				className="underline cursor-pointer text-sub-red-30"
			>
				로그아웃하기
			</button>

			<AnimatePresence>
				{isModalOpen && (
					<ConfirmModal
						onClose={closeLogoutModal}
						onConfirm={handleConfirmLogout}
						title="로그아웃 하시겠습니까?"
						confirmLabel="로그아웃"
						cancelLabel="취소"
					/>
				)}
			</AnimatePresence>
		</>
	);
};
