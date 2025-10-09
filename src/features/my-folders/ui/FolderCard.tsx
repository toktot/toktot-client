'use client';

import { useState } from 'react';

import { useReviewFolderStore } from '@/entities/review-folder/model/store';
import { ReviewFolder } from '@/entities/review-folder/model/types';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { ConfirmModal } from '@/features/report/ui/ConfirmModal';

import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetOverlay,
} from '@/shared/components/BottomSheet';
import { isHTTPError, isTimeoutError } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';

interface FolderCardProps {
	folder: ReviewFolder;
}

export const FolderCard = ({ folder }: FolderCardProps) => {
	const router = useRouter();
	const { renameFolder, deleteFolder } = useReviewFolderStore();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState(folder.name);

	const handleCardClick = () => {
		router.push(`/my/saved/${folder.id}`);
	};

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
			<div
				onClick={handleCardClick}
				className="relative w-full p-3 h-[20vh] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:bg-grey-10 transition-colors"
			>
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Icon name="Bookmark" size="m" className="text-grey-600" />
						<div>
							<h3 className="font-semibold text-grey-900">{folder.name}</h3>
							<p className="text-sm text-grey-500">
								{folder.reviewCount}개의 리뷰
							</p>
						</div>
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsMenuOpen(true);
						}}
						className="p-1"
					>
						<Icon name="Kebab" size="s" />
					</button>
				</div>
			</div>

			<BottomSheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
				<BottomSheetOverlay />
				<BottomSheetContent>
					<div className="flex flex-col p-2">
						<button
							onClick={() => {
								setIsMenuOpen(false);
								setIsRenameModalOpen(true);
							}}
							className="p-4 text-left rounded-lg hover:bg-grey-10"
						>
							이름 변경
						</button>
						<button
							onClick={() => {
								setIsMenuOpen(false);
								setIsDeleteModalOpen(true);
							}}
							className="p-4 text-left text-sub-red-30 rounded-lg hover:bg-grey-10"
						>
							폴더 삭제
						</button>
					</div>
				</BottomSheetContent>
			</BottomSheet>

			<AnimatePresence>
				{isRenameModalOpen && (
					<ConfirmModal
						onClose={() => setIsRenameModalOpen(false)}
						onConfirm={handleRename}
						title="폴더 이름 변경"
						confirmLabel="변경"
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
					/>
				)}
			</AnimatePresence>
		</>
	);
};
