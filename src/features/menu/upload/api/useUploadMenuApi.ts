'use client';

import toast from 'react-hot-toast';

import { ApiError } from '@/shared/api/ApiError';

import { useMenuImageStore } from '../model/useMenuImageStore';
import { uploadMenuImagesApi } from './api';

/**
 * 메뉴 업로드 API를 호출하는 커스텀 훅
 */
export const useUploadMenuApi = () => {
	const { images, setIsUploading, reset } = useMenuImageStore();

	const uploadMenuImages = async (storeId: string) => {
		if (images.length === 0) {
			toast.error('이미지를 1장 이상 등록해주세요.');
			return false;
		}

		setIsUploading(true);

		try {
			const files = images.map((img) => img.file);
			await uploadMenuImagesApi(storeId, files);

			toast.success('메뉴판 이미지가 성공적으로 등록되었습니다.');
			reset(); // 성공 시 상태 초기화
			setIsUploading(false);
			return true;
		} catch (error) {
			const message = error instanceof ApiError ? error.message : '알 수 없는 오류로 업로드에 실패했습니다.';
			toast.error(message);
			setIsUploading(false);
			return false;
		}
	};

	return { uploadMenuImages };
};
