'use client';

import { ReviewFolder } from '@/entities/review-folder/model/types';
import { useRouter } from 'next/navigation';

import Icon from '@/shared/ui/Icon';

interface FolderCardProps {
	folder: ReviewFolder;
}

export const FolderCard = ({ folder }: FolderCardProps) => {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/my/saved/${folder.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className="relative w-full p-3 h-[20vh] rounded-lg overflow-hidden shadow-sm cursor-pointer hover:bg-grey-10 transition-colors"
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Icon name="Bookmark" size="m" className="text-grey-600" />
					<div>
						<h3 className="font-semibold text-grey-900">{folder.name}</h3>
						<p className="text-sm text-grey-500">
							{folder.reviewCount}개의 리뷰
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
