'use client';

import clsx from 'clsx';

import { CustomCheckbox } from '@/shared/ui/CustomCheckbox';
import Icon from '@/shared/ui/Icon';

import { ReviewFolder } from '../model/types';

interface FolderListItemProps {
	folder: ReviewFolder;
	isFolderFull: boolean;
	isAlreadySaved: boolean;
	isSelected: boolean;
	onToggle: () => void;
}

export const FolderListItem = ({
	folder,
	isFolderFull,
	isAlreadySaved,
	isSelected,
	onToggle,
}: FolderListItemProps) => {
	const checked = isAlreadySaved || isSelected;
	const disabled = isAlreadySaved;

	return (
		<li
			onClick={() => !disabled && onToggle()}
			className={clsx(
				'flex items-center justify-between rounded-lg p-3 transition-colors',
				disabled
					? 'cursor-not-allowed bg-grey-10'
					: 'cursor-pointer hover:bg-grey-10',
			)}
		>
			<div
				className={clsx('flex items-center gap-3', disabled && 'opacity-50')}
			>
				<Icon name="Bookmark" size="m" className="text-grey-60" />
				<div className="flex flex-col">
					<span className="font-medium text-grey-90">{folder.name}</span>
				</div>
				<span
					className={clsx(
						'text-sm',
						isFolderFull ? 'text-sub-red-30 font-bold' : 'text-grey-50',
					)}
				>
					{folder.reviewCount}
				</span>
			</div>
			<CustomCheckbox
				checked={checked}
				onChange={() => !disabled && onToggle()}
				aria-label={`${folder.name} 폴더 선택`}
			/>
		</li>
	);
};
