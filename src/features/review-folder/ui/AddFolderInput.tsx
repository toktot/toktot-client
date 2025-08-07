import { useState } from 'react';

import Icon from '@/shared/ui/Icon';

export const AddFolderInput = ({
	onAdd,
}: {
	onAdd: (name: string) => void;
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState('');

	const handleAdd = () => {
		if (name.trim()) {
			onAdd(name.trim());
			setName('');
			setIsEditing(false);
		}
	};

	if (!isEditing) {
		return (
			<button
				onClick={() => setIsEditing(true)}
				className="flex w-full items-center gap-2 rounded-lg p-3 text-grey-70 hover:bg-grey-10"
			>
				<div className="flex justify-center items-center w-7 h-7 relative rounded outline outline-offset-[-1px] outline-grey-50">
					<Icon className="text-grey-50" name="Plus" size="s" />
				</div>
				<span className="text-grey-60">폴더 추가하기</span>
			</button>
		);
	}

	return (
		<div className="flex items-center gap-2 h-12">
			<input
				type="text"
				id="folder-name-input"
				name="folderName"
				value={name}
				onChange={(e) => setName(e.target.value)}
				maxLength={10}
				placeholder="폴더명 (10자 이내)"
				className="flex flex-1 h-full px-4 bg-grey-10 rounded-2xl"
				onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
				autoFocus
			/>
			<button
				onClick={handleAdd}
				className={`rounded-2xl h-full px-4 text-white ${
					name.trim() ? 'bg-grey-90' : 'bg-grey-30'
				}`}
			>
				추가하기
			</button>
		</div>
	);
};
