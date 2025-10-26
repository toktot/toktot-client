'use client';

import toast from 'react-hot-toast';
import { create } from 'zustand';

import { useReviewFeedStore } from '@/features/review/read/hooks/useReviewFeedStore';

import { createAuthApi } from '@/shared/api';
import { ReviewFolderId, ReviewId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createFolderApi } from '../api/folder';
import type { FolderClient } from '../api/folder';
import {
	MAX_FOLDERS,
	MAX_FOLDER_LENGTH,
	MAX_REVIEWS_PER_FOLDER,
} from './constants';
import type { ReviewFolder } from './types';

interface ReviewFolderState {
	folders: ReviewFolder[];
	isLoading: boolean;

	fetchFolders: () => Promise<void>;
	addFolder: (name: string) => Promise<{ success: boolean }>;
	saveReviewsToFolders: (
		reviewId: ReviewId,
		folderIds: ReviewFolderId[],
	) => Promise<{ success: boolean; fullFolders?: string[] }>;
	renameFolder: (folderId: ReviewFolderId, newName: string) => Promise<void>;
	deleteFolder: (folderId: ReviewFolderId) => Promise<void>;
}

const mapFolderClientToReviewFolder = (f: FolderClient): ReviewFolder => ({
	id: f.id as ReviewFolderId,
	name: f.name,
	reviewCount: f.reviewCount ?? 0,
	isDefault: false,
	reviewIds: [], // 서버에서 reviewIds를 주지 않는다면 빈 배열; 필요하면 API 확장
});

export const useReviewFolderStore = create<ReviewFolderState>()((set, get) => {
	const getToken = () => getDecryptedToken() ?? undefined;
	const authKy = createAuthApi({
		getToken,
		onAuthError: (status) => {
			// 필요하면 전역 상태 변경/리다이렉트 처리
			console.warn('auth error status', status);
		},
	});
	const api = createFolderApi(authKy);

	return {
		folders: [],
		isLoading: false,

		fetchFolders: async () => {
			set({ isLoading: true });
			try {
				const serverFolders = await api.getFolders(); // FolderClient[]
				const mapped = serverFolders.map(mapFolderClientToReviewFolder);
				set({ folders: mapped, isLoading: false });
			} catch (err: unknown) {
				console.error('폴더 목록 조회 실패:', err);
				set({ isLoading: false });
			}
		},

		addFolder: async (name: string) => {
			const { folders } = get();

			if (folders.length >= MAX_FOLDERS) {
				toast.error('폴더는 총 10개까지 가질 수 있습니다.');
				return { success: false };
			}

			if (name.length > MAX_FOLDER_LENGTH) {
				toast.error('폴더 이름 길이 제한을 초과했습니다. (50자까지)');
				return { success: false };
			}

			set({ isLoading: true });
			try {
				const created = await api.createFolder({ folder_name: name }); // FolderClient
				const newFolder = mapFolderClientToReviewFolder(created);

				set((state) => ({
					folders: [...state.folders, newFolder],
					isLoading: false,
				}));

				return { success: true };
			} catch (err: unknown) {
				console.error('폴더 추가 실패:', err);
				set({ isLoading: false });
				return { success: false };
			}
		},

		saveReviewsToFolders: async (reviewId, folderIds) => {
			const { folders } = get();

			const fullFolders = folders.filter(
				(folder) =>
					folderIds.includes(folder.id) &&
					folder.reviewCount >= MAX_REVIEWS_PER_FOLDER &&
					!folder.reviewIds.includes(reviewId),
			);

			if (fullFolders.length > 0) {
				return { success: false, fullFolders: fullFolders.map((f) => f.name) };
			}

			set({ isLoading: true });
			try {
				const updatedServerFolders = await api.saveReviewToFolders({
					folder_ids: folderIds.map((id) => Number(id)),
					review_id: Number(reviewId),
				});

				const mapped = updatedServerFolders.map(mapFolderClientToReviewFolder);
				set({ folders: mapped, isLoading: false });

        useReviewFeedStore.getState().updateBookmarkStatus(reviewId, true);

				return { success: true };
			} catch (err: unknown) {
				console.error('리뷰 저장 실패:', err);
				set({ isLoading: false });
				return { success: false };
			}
		},

		renameFolder: async (folderId, newName) => {
			const oldFolders = get().folders;
			set((state) => ({
				folders: state.folders.map((f) =>
					f.id === folderId ? { ...f, name: newName } : f,
				),
			}));

			try {
				await api.renameFolder(Number(folderId), newName);
			} catch (error) {
				set({ folders: oldFolders });
				throw error;
			}
		},

		deleteFolder: async (folderId) => {
			const oldFolders = get().folders;
			set((state) => ({
				folders: state.folders.filter((f) => f.id !== folderId),
			}));

			try {
				await api.deleteFolder(Number(folderId));
			} catch (error) {
				set({ folders: oldFolders });
				throw error;
			}
		},
	};
});
