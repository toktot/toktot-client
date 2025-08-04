'use client';

import { useState } from 'react';

import { MAX_REVIEWS_PER_FOLDER } from '@/entities/review-folder/model/constants';
import { useReviewFolderStore } from '@/entities/review-folder/model/store';
import { FolderListItem } from '@/entities/review-folder/ui/FolderList';

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
			<div className="my-4 flex flex-col">
				{folders.map((folder) => {
					const isAlreadySaved = folder.reviewIds.includes(reviewId);
					const isFolderFull = folder.reviewCount >= MAX_REVIEWS_PER_FOLDER;

					return (
						<FolderListItem
							key={folder.id}
							folder={folder}
							isFolderFull={isFolderFull}
							isAlreadySaved={isAlreadySaved}
							isSelected={selectedFolderIds.includes(folder.id)}
							onToggle={() => handleToggleFolder(folder.id)}
						/>
					);
				})}
				<AddFolderInput onAdd={addFolder} />
			</div>

			<PrimaryButton
				text="저장하기"
				onClick={handleSave}
				disabled={selectedFolderIds.length === 0}
				className="w-full"
			/>
		</div>
	);
};
