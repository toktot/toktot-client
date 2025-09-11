'use client';

import { useEffect } from 'react';

import { useReviewFolderStore } from '@/entities/review-folder/model/store';

import { FolderCard } from './FolderCard';

export const FolderList = () => {
	const { folders, isLoading, fetchFolders } = useReviewFolderStore();

	useEffect(() => {
		fetchFolders();
	}, [fetchFolders]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="h-[20vh] w-full rounded-lg bg-grey-200 animate-pulse bg-grey-10"
					/>
				))}
			</div>
		);
	}

	if (folders.length === 0) {
		return (
			<div className="p-10 text-center text-grey-500">폴더가 없습니다.</div>
		);
	}

	return (
		<div className="p-4">
			<div className="grid grid-cols-2 gap-4">
				{folders.map((folder) => (
					<FolderCard key={folder.id} folder={folder} />
				))}
			</div>
		</div>
	);
};
