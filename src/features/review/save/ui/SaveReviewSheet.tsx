'use client';

import { useState } from 'react';

import { useReviewFolderStore } from '@/entities/review-folder/model/store';
import { FolderList } from '@/entities/review-folder/ui/FolderList';

import { AddFolderInput } from '@/features/review-folder/ui/AddFolderInput';

import PrimaryButton from '@/shared/components/PrimaryButton';
import { ReviewFolderId, ReviewId } from '@/shared/model/types';

interface SaveReviewSheetProps {
	reviewId: ReviewId;
	onClose: () => void;
}

export const SaveReviewSheet = ({
	reviewId,
	onClose,
}: SaveReviewSheetProps) => {
	const { folders, addFolder, saveReviewsToFolders } = useReviewFolderStore();
	const [selectedFolderIds, setSelectedFolderIds] = useState<ReviewFolderId[]>([
		folders.find((f) => f.isDefault)!.id,
	]);

	const handleToggleFolder = (folderId: ReviewFolderId) => {
		setSelectedFolderIds((prev) =>
			prev.includes(folderId)
				? prev.filter((id) => id !== folderId)
				: [...prev, folderId],
		);
	};

	const handleSave = async () => {
		const result = await saveReviewsToFolders(reviewId, selectedFolderIds);

		if (result.success) {
			onClose();
			//TODO: toast 알림
		} else {
			const errorMessage = result.fullFolders?.length
				? `다음 폴더는 저장 공간이 가득 찼습니다:\n[${result.fullFolders.join(', ')}]`
				: '리뷰 저장에 실패했습니다.';
			alert('error' + errorMessage);
		}
	};

	return (
		<div className="flex h-full flex-col p-4">
			<div className="mx-auto mb-3 h-1 w-6 rounded-full bg-grey-30" />
			<h2 className="text-lg font-bold">저장할 폴더 선택</h2>

			<div className="my-4 flex flex-grow flex-col overflow-hidden">
				<FolderList
					folders={folders}
					selectedIds={selectedFolderIds}
					onToggle={handleToggleFolder}
				/>
				<div className="mt-2 flex-shrink-0">
					<AddFolderInput onAdd={addFolder} />
				</div>
			</div>

			<div className="mt-auto pt-4">
				<PrimaryButton
					text="저장하기"
					onClick={handleSave}
					disabled={selectedFolderIds.length === 0}
					className="w-full"
				/>
			</div>
		</div>
	);
};
