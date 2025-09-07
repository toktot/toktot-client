'use client';

import { useEffect } from 'react';

import toast from 'react-hot-toast';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createWriteReviewApi } from '@/features/review/write/api/api';

import { createAuthApi } from '@/shared/api';
import { validateFiles } from '@/shared/lib/validateFiles';
import { ReviewImageId, StoreId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { mapServerImagesToUploadReviewImages } from '../api/mappers';
import { MAX_FILE_SIZE, MAX_IMAGE_COUNT } from '../model/constants';
import { UploadReviewImage } from '../model/image';

interface ReviewImageState {
	images: UploadReviewImage[];
	mainImageId: ReviewImageId | null;
	isLoading: boolean;
	remainingSlots: number | null;
	restaurantId: number | null;
}

interface ReviewImageActions {
	setRestaurantId: (id: number) => void;
	initializeImages: () => Promise<void>;
	uploadImages: (files: File[]) => Promise<void>;
	deleteImage: (imageId: ReviewImageId) => Promise<void>;
	clearImages: () => Promise<void>;
	setMainImage: (id: ReviewImageId) => void;
	clearAllState: () => void;
}

const initialState: ReviewImageState = {
	images: [],
	mainImageId: null,
	isLoading: false,
	remainingSlots: null,
	restaurantId: null,
};

export const useReviewImageStore = create<
	ReviewImageState & ReviewImageActions
>()(
	immer((set, get) => ({
		...initialState,

		setRestaurantId: (id) => {
			set({ restaurantId: id });
		},

		initializeImages: async () => {
			const { restaurantId } = get();
			if (!restaurantId) return;

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);
			set({ isLoading: true });

			try {
				const sessionData = await api.getImageSession(restaurantId);
				if (sessionData && sessionData.has_session) {
					const clientImages = mapServerImagesToUploadReviewImages(
						sessionData.images,
					);
					set((state) => {
						state.images = clientImages;
						if (clientImages.length > 0) {
							state.mainImageId = clientImages[0].id;
						} else {
							state.mainImageId = null;
						}
						state.remainingSlots = sessionData.remaining_slots;
					});
				} else {
					// No session or empty session, clear local state
					set((state) => {
						state.images = [];
						state.mainImageId = null;
						state.remainingSlots = MAX_IMAGE_COUNT;
					});
				}
			} catch (error) {
				console.error('이미지 세션 조회 실패:', error);
			} finally {
				set({ isLoading: false });
			}
		},

		uploadImages: async (files) => {
			const { restaurantId, remainingSlots } = get();
			if (!restaurantId) return;

			const { validFiles, errorMessage } = await validateFiles(
				files,
				remainingSlots ?? MAX_IMAGE_COUNT,
				MAX_FILE_SIZE,
			);

			if (errorMessage) {
				toast.error(errorMessage);
			}
			if (validFiles.length === 0) return;

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);
			set({ isLoading: true });

			const formData = new FormData();
			validFiles.forEach((file) => formData.append('files', file));
			formData.append('id', String(restaurantId));

			try {
				const response = await api.uploadImages(formData);
				const clientImages = mapServerImagesToUploadReviewImages(
					response.all_images,
				);
				set((state) => {
					state.images = clientImages;
					state.remainingSlots = response.remaining_slots;
					// 이미지가 새로 추가되었을 때, 대표 이미지가 없다면 첫번째를 대표로 지정
					if (!state.mainImageId && clientImages.length > 0) {
						state.mainImageId = clientImages[0].id;
					}
				});
			} catch (error) {
				console.error('이미지 업로드 실패:', error);
				toast.error(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set({ isLoading: false });
			}
		},

		deleteImage: async (imageId) => {
			const { restaurantId } = get();
			if (!restaurantId) return;

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);
			set({ isLoading: true });

			try {
				const response = await api.deleteImage(imageId, restaurantId);
				const clientImages = mapServerImagesToUploadReviewImages(
					response.images,
				);
				set((state) => {
					state.images = clientImages;
					state.remainingSlots = response.remaining_slots;
					// 삭제된 이미지가 대표 이미지였다면, 다음 이미지를 새 대표로 설정
					if (state.mainImageId === imageId) {
						state.mainImageId =
							clientImages.length > 0 ? clientImages[0].id : null;
					}
				});
			} catch (error) {
				console.error('이미지 삭제 실패:', error);
				toast.error(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set({ isLoading: false });
			}
		},

		clearImages: async () => {
			const { restaurantId } = get();
			if (!restaurantId) return;

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);
			set({ isLoading: true });

			try {
				await api.clearImageSession(restaurantId);
				set(initialState); // 모든 상태를 초기값으로 리셋
			} catch (error) {
				console.error('이미지 세션 초기화 실패:', error);
				toast.error(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set({ isLoading: false });
			}
		},

		setMainImage: (id) => {
			set({ mainImageId: id });
		},

		clearAllState: () => {
			set(initialState);
		},
	})),
);

export const useReviewImageManager = (restaurantId: StoreId) => {
	const {
		images,
		isLoading,
		remainingSlots,
		// totalCount,
		initializeImages,
		uploadImages,
		deleteImage,
		clearImages,
		setRestaurantId,
		setMainImage,
		mainImageId,
	} = useReviewImageStore();

	useEffect(() => {
		setRestaurantId(Number(restaurantId));
	}, [restaurantId, setRestaurantId]);

	return {
		images,
		isLoading,
		remainingSlots,
		// totalCount,
		initializeImages,
		uploadImages,
		deleteImage,
		clearImages,
		setMainImage,
		mainImageId,
	};
};
