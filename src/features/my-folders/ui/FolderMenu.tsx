'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { ReviewFolder } from '@/entities/review-folder/model/types';
import { useReviewFolderStore } from '@/entities/review-folder/model/store';
import { ConfirmModal } from '@/features/report/ui/ConfirmModal';
import { isHTTPError, isTimeoutError } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

interface FolderMenuProps {
	folder: ReviewFolder;
	isMenuOpen: boolean;
	onMenuToggle: () => void;
	closeMenu: () => void;
}

export const FolderMenu = ({ folder, isMenuOpen, onMenuToggle, closeMenu }: FolderMenuProps) => {
	const { renameFolder, deleteFolder } = useReviewFolderStore();
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState(folder.name);

	const handleRename = async () => {
		if (!newFolderName.trim() || newFolderName === folder.name) {
			setIsRenameModalOpen(false);
			return;
		}
		try {
			await renameFolder(folder.id, newFolderName);
			toast.success('폴더 이름이 변경되었습니다.');
		} catch (error: unknown) {
			if (isHTTPError(error)) {
				const status = error.response.status;
				if (status === 409) toast.error('이미 존재하는 이름입니다.');
				else toast.error(`서버 오류 (${status})`);
			} else if (isTimeoutError(error)) {
				toast.error('요청이 시간 초과되었습니다.');
			} else {
				toast.error('이름 변경에 실패했습니다.');
			}
		} finally {
			setIsRenameModalOpen(false);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteFolder(folder.id);
			toast.success('폴더가 삭제되었습니다.');
		} catch (error: unknown) {
			if (isHTTPError(error)) {
				toast.error(`삭제 실패 (서버 코드: ${error.response.status})`);
			} else {
				toast.error('폴더 삭제에 실패했습니다.');
			}
		} finally {
			setIsDeleteModalOpen(false);
		}
	};

	return (
		<>
			<div className="relative z-10">
				<button
					onClick={(e) => {
						e.stopPropagation();
						onMenuToggle();
					}}
					className="p-1"
				>
					<Icon name="Kebab" size="s" />
				</button>
				{isMenuOpen && (
					<div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-grey-20">
						<button
							onClick={(e) => {
								e.stopPropagation();
								closeMenu();
									setIsRenameModalOpen(true);
								}}
								className="w-full p-2 text-left text-sm hover:bg-grey-10 rounded-t-lg"
							>
								이름 변경
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									closeMenu();
									setIsDeleteModalOpen(true);
								}}
								className="w-full p-2 text-left text-sm text-sub-red-30 hover:bg-grey-10 rounded-b-lg"
							>
								폴더 삭제
							</button>
						</div>
					)}
			</div>

			<AnimatePresence>
				{isRenameModalOpen && (
					<ConfirmModal
						onClose={() => setIsRenameModalOpen(false)}
						onConfirm={handleRename}
						title="폴더 이름 변경"
						confirmLabel="변경"
						cancelLabel="취소"
					>
						<input
							type="text"
							value={newFolderName}
							onChange={(e) => setNewFolderName(e.target.value)}
							className="w-full p-2 border rounded mt-4 mb-2"
							autoFocus
						/>
					</ConfirmModal>
				)}
				{isDeleteModalOpen && (
					<ConfirmModal
						onClose={() => setIsDeleteModalOpen(false)}
						onConfirm={handleDelete}
						title={`'${folder.name}' 폴더를 삭제하시겠습니까?`}
						confirmLabel="삭제"
						cancelLabel="취소"
					/>
				)}
			</AnimatePresence>
		</>
	);
};