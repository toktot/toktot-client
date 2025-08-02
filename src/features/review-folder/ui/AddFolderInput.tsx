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
		<div className="flex items-center gap-2 p-2">
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				maxLength={10}
				placeholder="폴더명 (10자 이내)"
				className="flex-grow rounded-md border border-grey-30 px-3 py-2 focus:border-primary-50 focus:outline-none"
				onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
				autoFocus
			/>
			<button
				onClick={handleAdd}
				className="rounded-md bg-primary-50 px-4 py-2 text-white"
			>
				추가
			</button>
		</div>
	);
};
