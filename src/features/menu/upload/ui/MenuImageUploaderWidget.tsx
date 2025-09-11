'use client';

import { ChangeEvent } from 'react';

import Image from 'next/image';
import toast from 'react-hot-toast';

import { validateFiles } from '@/shared/lib/validateFiles';
import Icon from '@/shared/ui/Icon';
import Typography from '@/shared/ui/Typography';

import { useMenuImageStore } from '../model/useMenuImageStore';

const MAX_MENU_IMAGES = 10;
const MAX_FILE_SIZE_MB = 5;

export const MenuImageUploaderWidget = () => {
	const { images, addImages, removeImage } = useMenuImageStore();

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const { validFiles, errorMessage } = await validateFiles(
			Array.from(files),
			MAX_MENU_IMAGES - images.length, // 현재 업로드된 개수를 고려하여 최대 개수 제한
			MAX_FILE_SIZE_MB * 1024 * 1024,
		);

		if (errorMessage) {
			toast.error(errorMessage);
		}

		if (validFiles.length > 0) {
			addImages(validFiles);
		}

		// input 값 초기화하여 같은 파일을 다시 선택할 수 있도록 함
		e.target.value = '';
	};

	return (
		<section className="w-full space-y-3">
			<Typography as="h2" className="text-2xl">
				가격 메뉴판을
				<br />
				등록해주세요!
			</Typography>
			<p className="text-xs text-grey-80">
				어둡지 않고 선명할수록 메뉴 정보에 오류가 줄어들어요
			</p>
			<div className="flex flex-wrap gap-4">
				{images.map((image) => (
					<div key={image.id} className="relative w-24 h-24 rounded-lg">
						<Image
							src={image.previewUrl}
							alt="메뉴판 이미지 미리보기"
							fill
							className="object-cover rounded-lg"
						/>
						<button
							onClick={() => removeImage(image.id)}
							className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
							aria-label="이미지 삭제"
						>
							<Icon name="Cancel" size="xxs" className="text-white" />
						</button>
					</div>
				))}

				{images.length < MAX_MENU_IMAGES && (
					<label className="w-full h-60 bg-grey-10 flex flex-col items-center justify-center cursor-pointer rounded-lg text-grey-50">
						<input
							type="file"
							className="hidden"
							onChange={handleFileChange}
							multiple
							accept=".jpeg, .jpg, .png"
						/>
						<Icon name="Plus" size="s" />
						<span className="text-xs mt-1">
							{images.length}/{MAX_MENU_IMAGES}
						</span>
					</label>
				)}
			</div>
		</section>
	);
};
