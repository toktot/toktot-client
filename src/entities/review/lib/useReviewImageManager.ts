'use client';

import { useCallback, useMemo, useState } from 'react';

import { createWriteReviewApi } from '@/features/review/write/api/api';

import { createAuthApi } from '@/shared/api';
import { validateFiles } from '@/shared/lib/validateFiles';
import { ReviewImageId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { mapServerImagesToUploadReviewImages } from '../api/mappers';
import { MAX_IMAGE_COUNT } from '../model/constants';
import { UploadReviewImage } from '../model/image';

export const useReviewImageManager = (restaurantId: number) => {
	const [images, setImages] = useState<UploadReviewImage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [remainingSlots, setRemainingSlots] = useState<number | null>(null);
	console.log('🚀 ~ useReviewImageManager ~ remainingSlots:', remainingSlots);
	const [totalCount, setTotalCount] = useState<number | null>(null);

	const api = useMemo(() => {
		const getToken = () => getDecryptedToken() ?? undefined;
		const authKy = createAuthApi({ getToken });
		return createWriteReviewApi(authKy);
	}, []);

	const updateStateFromResponse = ({
		remaining_slots,
		total_image_count,
	}: {
		remaining_slots: number;
		total_image_count: number;
	}) => {
		setRemainingSlots(remaining_slots);
		setTotalCount(total_image_count);
	};

	// 기존 이미지 세션이 있는지 확인
	const initializeImages = useCallback(async () => {
		if (!restaurantId) return;
		setIsLoading(true);
		try {
			const sessionData = await api.getImageSession(restaurantId);

			if (sessionData.has_session) {
				const clientImages = mapServerImagesToUploadReviewImages(
					sessionData.images,
				);

				setImages(clientImages);
			}
		} catch (error) {
			console.error('이미지 세션 조회 실패:', error);
		} finally {
			setIsLoading(false);
		}
	}, [restaurantId, api]);

	// 이미지 업로드
	const uploadImages = async (files: File[]) => {
		if (!restaurantId) return;

		const { validFiles, errorMessage } = validateFiles(
			files,
			remainingSlots ?? MAX_IMAGE_COUNT,
		);

		if (errorMessage) {
			alert(errorMessage);
		}

		if (validFiles.length === 0) {
			return;
		}

		setIsLoading(true);
		const formData = new FormData();
		validFiles.forEach((file) => formData.append('files', file));
		formData.append('restaurant_id', String(restaurantId));

		try {
			const response = await api.uploadImages(formData);
			console.log('🚀 ~ uploadImages ~ response:', response);
			const { total_image_count, remaining_slots } = response;
			updateStateFromResponse({ total_image_count, remaining_slots });

			const clientImages = mapServerImagesToUploadReviewImages(
				response.all_images,
			);

			setImages(clientImages);
		} catch (error) {
			console.error('이미지 업로드 실패:', error);
			alert(error instanceof Error ? error.message : '알 수 없는 오류');
		} finally {
			setIsLoading(false);
		}
	};

	// 이미지 삭제
	const deleteImage = async (imageId: ReviewImageId) => {
		if (!restaurantId) return;
		setIsLoading(true);
		try {
			const response = await api.deleteImage(imageId, restaurantId);
			const clientImages = mapServerImagesToUploadReviewImages(response.images);

			setImages(clientImages);
		} catch (error) {
			console.error('이미지 삭제 실패:', error);
			alert(error instanceof Error ? error.message : '알 수 없는 오류');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		images,
		isLoading,
		initializeImages,
		uploadImages,
		deleteImage,
		remainingSlots,
		totalCount,
	};
};
