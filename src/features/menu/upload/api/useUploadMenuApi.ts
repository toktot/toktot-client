'use client';

import toast from 'react-hot-toast';

import { useMenuImageStore } from '../model/useMenuImageStore';

/**
 * 메뉴 업로드 API를 호출하는 커스텀 훅 (현재는 모킹됨)
 */
export const useUploadMenuApi = () => {
	const { images, setIsUploading, reset } = useMenuImageStore();

	const uploadMenuImages = async (storeId: string) => {
		if (images.length === 0) {
			toast.error('이미지를 1장 이상 등록해주세요.');
			return;
		}

		setIsUploading(true);

		const formData = new FormData();
		formData.append('storeId', storeId);
		images.forEach((img) => {
			formData.append('menuImages', img.file);
		});

		// --- API 호출 (모킹) ---
		console.log('Uploading to store:', storeId);
		console.log('FormData content:', Object.fromEntries(formData.entries()));

		await new Promise((resolve) => setTimeout(resolve, 1500)); // 가상 네트워크 지연

		console.log('Mock upload successful!');

		setIsUploading(false);
		reset();
	};

	return { uploadMenuImages };
};
