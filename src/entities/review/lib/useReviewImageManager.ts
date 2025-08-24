'use client';

import { useMemo } from 'react';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createWriteReviewApi } from '@/features/review/write/api/api';

import { createAuthApi } from '@/shared/api';
import { validateFiles } from '@/shared/lib/validateFiles';
import { ReviewImageId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { mapServerImagesToUploadReviewImages } from '../api/mappers';
import { MAX_FILE_SIZE, MAX_IMAGE_COUNT } from '../model/constants';
import { UploadReviewImage } from '../model/image';

// ────────── 타입 정의 ──────────
interface ReviewImageState {
	images: UploadReviewImage[];
	isLoading: boolean;
	remainingSlots: number | null;
	totalCount: number | null;
	restaurantId: number | null;
}

interface ReviewImageActions {
	setRestaurantId: (id: number) => void;
	initializeImages: () => Promise<void>;
	uploadImages: (files: File[]) => Promise<void>;
	deleteImage: (imageId: ReviewImageId) => Promise<void>;
	clearImages: () => Promise<void>;
	clearAllState: () => void;
}

interface ReviewImageSelectors {
	canUploadMore: boolean;
	uploadCount: number;
}

// ────────── 구현 ──────────
export const useReviewImageStore = create<
	ReviewImageState & ReviewImageActions & ReviewImageSelectors
>()(
	immer((set, get) => ({
		images: [],
		isLoading: false,
		remainingSlots: null,
		totalCount: null,
		restaurantId: null,

		setRestaurantId: (id) => {
			set((state) => {
				state.restaurantId = id;
			});
		},

		initializeImages: async () => {
			const { restaurantId } = get();
			if (!restaurantId) return;

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);

			set((state) => {
				state.isLoading = true;
			});

			try {
				const sessionData = await api.getImageSession(restaurantId);

				if (sessionData.has_session) {
					const clientImages = mapServerImagesToUploadReviewImages(
						sessionData.images,
					);

					set((state) => {
						state.images = clientImages;
					});
				}
			} catch (error) {
				console.error('이미지 세션 조회 실패:', error);
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		},

		uploadImages: async (files) => {
			const { restaurantId, remainingSlots } = get();
			if (!restaurantId) return;

			const { validFiles, errorMessage } = validateFiles(
				files,
				remainingSlots ?? MAX_IMAGE_COUNT,
				MAX_FILE_SIZE,
			);

			if (errorMessage) {
				alert(errorMessage);
			}

			if (validFiles.length === 0) {
				return;
			}

			const api = createWriteReviewApi(
				createAuthApi({
					getToken: () => getDecryptedToken() ?? undefined,
				}),
			);

			set((state) => {
				state.isLoading = true;
			});

			const formData = new FormData();
			validFiles.forEach((file) => formData.append('files', file));
			formData.append('external_kakao_id', String(restaurantId));

			try {
				const response = await api.uploadImages(formData);
				const { total_image_count, remaining_slots } = response;

				const clientImages = mapServerImagesToUploadReviewImages(
					response.all_images,
				);

				set((state) => {
					state.images = clientImages;
					state.remainingSlots = remaining_slots;
					state.totalCount = total_image_count;
				});
			} catch (error) {
				console.error('이미지 업로드 실패:', error);
				alert(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set((state) => {
					state.isLoading = false;
				});
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

			set((state) => {
				state.isLoading = true;
			});

			try {
				const response = await api.deleteImage(imageId, restaurantId);
				const clientImages = mapServerImagesToUploadReviewImages(
					response.images,
				);

				set((state) => {
					state.images = clientImages;
				});
			} catch (error) {
				console.error('이미지 삭제 실패:', error);
				alert(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set((state) => {
					state.isLoading = false;
				});
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

			set((state) => {
				state.isLoading = true;
			});

			try {
				await api.clearImageSession(restaurantId);
				set((state) => {
					state.images = [];
					state.remainingSlots = null;
					state.totalCount = null;
				});
			} catch (error) {
				console.error('이미지 세션 초기화 실패:', error);
				alert(error instanceof Error ? error.message : '알 수 없는 오류');
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		},

		clearAllState: () => {
			set(() => ({
				images: [],
				isLoading: false,
				remainingSlots: null,
				totalCount: null,
				restaurantId: null,
			}));
		},

		// Selectors
		get canUploadMore() {
			const { remainingSlots, images } = get();
			return remainingSlots !== null
				? remainingSlots > 0
				: images.length < MAX_IMAGE_COUNT;
		},

		get uploadCount() {
			const { images } = get();
			return images.length;
		},
	})),
);

// ────────── 기존 훅과의 호환성을 위한 래퍼 ──────────
export const useReviewImageManager = (restaurantId: number) => {
	const {
		images,
		isLoading,
		remainingSlots,
		totalCount,
		initializeImages,
		uploadImages,
		deleteImage,
		clearImages,
		setRestaurantId,
	} = useReviewImageStore();

	// restaurantId가 변경되면 스토어에 설정
	useMemo(() => {
		setRestaurantId(restaurantId);
	}, [restaurantId, setRestaurantId]);

	return {
		images,
		isLoading,
		remainingSlots,
		totalCount,
		initializeImages,
		uploadImages,
		deleteImage,
		clearImages,
	};
};
