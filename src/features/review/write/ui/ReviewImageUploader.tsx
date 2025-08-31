import { ChangeEvent } from 'react';

import { validateFiles } from '@/shared/lib/validateFiles';
import Icon from '@/shared/ui/Icon';

export const ReviewImageUploader = ({
	onUpload,
	maxCount,
	maxFileSize,
}: {
	onUpload: (files: File[]) => void;
	maxCount: number;
	maxFileSize: number;
}) => {
	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const fileArray = Array.from(files);
		const { validFiles, errorMessage } = await validateFiles(
			fileArray,
			maxCount,
			maxFileSize,
		);

		if (errorMessage) {
			alert(errorMessage);
		} else {
			onUpload(validFiles);
			e.target.value = '';
		}
	};

	return (
		<div className="w-full gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
			<label className="w-[100px] h-[100px] bg-grey-10 flex items-center justify-center cursor-pointer rounded flex-shrink-0">
				<input
					type="file"
					className="hidden"
					onChange={handleChange}
					multiple
					accept=".jpeg, .jpg, .png"
				/>
				<Icon className="text-grey-50" name={'Plus'} size="s" />
			</label>
		</div>
	);
};
