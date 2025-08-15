import { ChangeEvent } from 'react';

import { MAX_IMAGES_SIZE } from '@/entities/review';

import { validateFiles } from '@/shared/lib/validateFiles';
import Icon from '@/shared/ui/Icon';

export const ReviewImageUploader = ({
	onUpload,
	maxCount,
}: {
	onUpload: (files: File[]) => void;
	maxCount: number;
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const fileArray = Array.from(files);
		const { validFiles, errorMessage } = validateFiles(fileArray, maxCount);

		if (errorMessage) {
			alert(errorMessage);
		}

		onUpload(validFiles);

		e.target.value = '';
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
					max={MAX_IMAGES_SIZE}
				/>
				<Icon className="text-grey-50" name={'Plus'} size="s" />
			</label>
		</div>
	);
};
