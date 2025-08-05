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

			const defaultFolder = folders.find((f) => f.isDefault);
			return defaultFolder ? [defaultFolder.id] : [];
		},
	);

	const handleToggleFolder = (folderId: ReviewFolderId) => {
		setSelectedFolderIds((prev) =>
			prev.includes(folderId)
				? prev.filter((id) => id !== folderId)
				: [...prev, folderId],
		);
	};

	const isSaveButtonDisabled = useMemo(() => {
		const newlySelectedIds = selectedFolderIds.filter(
			(id) => !folders.find((f) => f.id === id)?.reviewIds.includes(reviewId),
		);

		return newlySelectedIds.length === 0;
	}, [selectedFolderIds, folders, reviewId]);

	const handleSave = async () => {
		const folderIdsToSave = selectedFolderIds.filter((id) => {
			const folder = folders.find((f) => f.id === id);
			return folder && !folder.reviewIds.includes(reviewId);
		});

		if (folderIdsToSave.length === 0) {
			onClose();
			return;
		}

		const result = await saveReviewsToFolders(reviewId, folderIdsToSave);

		if (result.success) {
			// TODO: 토스트로 대체하기
			alert('리뷰가 저장되었습니다.');
			onClose();
		} else {
			const errorMessage = result.fullFolders?.length
				? `다음 폴더는 저장 공간이 가득 찼습니다:\n[${result.fullFolders.join(', ')}]`
				: '리뷰 저장에 실패했습니다.';
			alert('error: ' + errorMessage);
		}
	};

	return (
		<div className="flex h-full flex-col p-4">
			<div className="mx-auto mb-3 h-1 w-6 rounded-full bg-grey-30" />
			<h2 className="text-lg font-bold">저장할 폴더 선택</h2>
			<div className="my-4 flex flex-grow flex-col overflow-hidden">
				<ul className="max-h-[40vh] flex-grow overflow-y-auto pr-2">
					{folders.map((folder) => {
						const isAlreadySaved = folder.reviewIds.includes(reviewId);
						const isFull =
							folder.reviewCount >= MAX_REVIEWS_PER_FOLDER && !isAlreadySaved;
						const isDisabled = isFull || isAlreadySaved;
						const isSelected = selectedFolderIds.includes(folder.id);

						return (
							<FolderListItem
								key={folder.id}
								folder={folder}
								isDisabled={isDisabled}
								isAlreadySaved={isAlreadySaved}
								isSelected={isSelected}
								onToggle={() => handleToggleFolder(folder.id)}
							/>
						);
					})}
				</ul>
				<div className="mt-2 flex-shrink-0">
					<AddFolderInput onAdd={addFolder} />
				</div>
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
