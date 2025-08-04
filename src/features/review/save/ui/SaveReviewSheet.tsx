'use client';

import { useMemo, useState } from 'react';

import { MAX_REVIEWS_PER_FOLDER } from '@/entities/review-folder/model/constants';
import { useReviewFolderStore } from '@/entities/review-folder/model/store';
import { FolderListItem } from '@/entities/review-folder/ui/FolderListItem';

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

	const [selectedFolderIds, setSelectedFolderIds] = useState<ReviewFolderId[]>(
		() => {
			const alreadySavedIds = folders
				.filter((f) => f.reviewIds.includes(reviewId))
				.map((f) => f.id);

			if (alreadySavedIds.length > 0) {
				return alreadySavedIds;
			}

			return [folders.find((f) => f.isDefault)!.id];
		},
	);

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
		}
	};

	const isSaveButtonDisabled = useMemo(() => {
		const newlySelectedIds = selectedFolderIds.filter(
			(selectedId) =>
				!folders.find((f) => f.id === selectedId)?.reviewIds.includes(reviewId),
		);

		if (newlySelectedIds.length === 0) return true;

		const areAllNewSelectionsFull = newlySelectedIds.every((id) => {
			const folder = folders.find((f) => f.id === id);
			return folder && folder.reviewCount >= MAX_REVIEWS_PER_FOLDER;
		});

		return areAllNewSelectionsFull;
	}, [folders, selectedFolderIds, reviewId]);

	return (
		<div className="flex h-full flex-col p-4">
			<div className="my-4 flex flex-col gap-2">
				{folders.map((folder) => {
					const isAlreadySaved = folder.reviewIds.includes(reviewId);
					const isFolderFull = folder.reviewCount >= MAX_REVIEWS_PER_FOLDER;
					const isDisabled =
						isAlreadySaved || (isFolderFull && !isAlreadySaved);
					const isSelected = selectedFolderIds.includes(folder.id);

					return (
						<FolderListItem
							key={folder.id}
							folder={folder}
							isAlreadySaved={isAlreadySaved}
							isSelected={isSelected}
							isDisabled={isDisabled}
							onToggle={() => !isDisabled && handleToggleFolder(folder.id)}
						/>
					);
				})}

				<AddFolderInput onAdd={addFolder} />
			</div>

			<PrimaryButton
				text="저장하기"
				onClick={handleSave}
				disabled={isSaveButtonDisabled}
				className="w-full"
			/>
		</div>
	);
};
