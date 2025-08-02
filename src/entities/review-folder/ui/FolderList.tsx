import { ReviewFolderId } from '@/shared/model/types';
import { CustomCheckbox } from '@/shared/ui/CustomCheckbox';
import Icon from '@/shared/ui/Icon';

import { ReviewFolder } from '../model/types';

export const FolderList = ({
	folders,
	selectedIds,
	onToggle,
}: {
	folders: ReviewFolder[];
	selectedIds: ReviewFolderId[];
	onToggle: (id: ReviewFolderId) => void;
}) => (
	<ul className="max-h-[40vh] flex-grow overflow-y-auto pr-2">
		{folders.map((folder) => {
			const isChecked = selectedIds.includes(folder.id);
			return (
				<li
					key={folder.id}
					onClick={() => onToggle(folder.id)}
					className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-grey-10"
				>
					<div className="flex items-center gap-3">
						<span className="font-medium">{folder.name}</span>
						<span className="text-sm text-grey-50">{folder.reviewCount}</span>
					</div>
					<CustomCheckbox
						checked={isChecked}
						onChange={() => onToggle(folder.id)}
						aria-label={`${folder.name} 폴더 선택`}
					/>
				</li>
			);
		})}
	</ul>
);
