'use client';

import { FolderCard } from './FolderCard';
import { useUserFolders } from '../model/useUserFolders';

const FolderListLoader = () => (
	<div className="p-4">
		<div className="grid grid-cols-2 gap-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-[20vh] w-full rounded-lg bg-grey-200 animate-pulse bg-grey-10"
				/>
			))}
		</div>
	</div>
);

export const UserFolderList = ({ userId }: { userId: number }) => {
	const { folders, isLoading, error } = useUserFolders(userId);

	if (isLoading) {
		return <FolderListLoader />;
	}

	if (error) {
		return <div className="p-4 text-sub-red-50">에러: {error}</div>;
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
					<FolderCard key={folder.id} folder={folder as any} />
				))}
			</div>
		</div>
	);
};
