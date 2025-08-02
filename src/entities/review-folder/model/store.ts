'use client';

import { nanoid } from 'nanoid';
import { create } from 'zustand';

import { ReviewFolderId, ReviewId } from '@/shared/model/types';

import { MAX_FOLDERS, MAX_REVIEWS_PER_FOLDER } from './constants';
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
}

const initialDefaultFolder: ReviewFolder = {
	id: 'default-folder' as ReviewFolderId,
	name: '기본 폴더',
	reviewCount: 0,
	isDefault: true,
	reviewIds: [],
};

export const useReviewFolderStore = create<ReviewFolderState>((set, get) => ({
	folders: [initialDefaultFolder],
	isLoading: false,

	/**
	 * [API 1: 폴더 목록 조회]
	 * - 호출 시점: 앱 초기 로딩 시, 또는 마이페이지 등 폴더 목록이 필요한 페이지에 처음 진입할 때.
	 * - 역할: 서버로부터 사용자의 전체 폴더 목록을 가져와 스토어 상태를 초기화합니다.
	 */
	fetchFolders: async () => {
		set({ isLoading: true });
		try {
			// const response = await fetch('/api/review-folders');
			// const data = await response.json();
			// set({ folders: data.folders, isLoading: false });

			// --- Mock API ---
			await new Promise((resolve) => setTimeout(resolve, 500));
			console.log('API CALLED: GET /api/review-folders');
			// 실제로는 API 응답으로 받은 폴더 목록으로 상태를 설정합니다.
			set({ isLoading: false });
		} catch (error) {
			console.error('폴더 목록 조회 실패:', error);
			set({ isLoading: false });
		}
	},

	/**
	 * [API 2: 새 폴더 추가]
	 * - 호출 시점: SaveReviewSheet에서 사용자가 새 폴더명을 입력하고 '추가' 버튼을 눌렀을 때.
	 * - 역할: 서버에 새 폴더 생성을 요청하고, 성공 시 응답으로 받은 새 폴더 정보를 상태에 추가합니다.
	 */
	addFolder: async (name: string) => {
		const { folders } = get();
		if (folders.length >= MAX_FOLDERS || name.length > 10) {
			// 클라이언트 측 유효성 검사는 그대로 유지
			alert('폴더 개수 또는 이름 길이 제한을 초과했습니다.');
			return { success: false };
		}

		try {
			// const response = await fetch('/api/review-folders', {
			//   method: 'POST',
			//   body: JSON.stringify({ name }),
			// });
			// const { newFolder } = await response.json();

			// --- Mock API ---
			await new Promise((resolve) => setTimeout(resolve, 300));
			console.log('API CALLED: POST /api/review-folders', { name });
			const newFolder: ReviewFolder = {
				id: nanoid() as ReviewFolderId,
				name,
				reviewCount: 0,
				isDefault: false,
				reviewIds: [],
			};
			// ---

			// 이유: 서버에서 생성된 고유 ID가 포함된 완전한 폴더 객체를 받아 상태에 추가해야,
			// 클라이언트와 서버의 데이터가 일치합니다.
			set((state) => ({ folders: [...state.folders, newFolder] }));
			return { success: true };
		} catch (error) {
			console.error('폴더 추가 실패:', error);
			return { success: false };
		}
	},

	/**
	 * [API 3: 리뷰를 폴더에 저장]
	 * - 호출 시점: SaveReviewSheet에서 사용자가 '저장하기' 버튼을 최종적으로 클릭했을 때.
	 * - 역할: 어떤 리뷰를 어떤 폴더들에 저장할지 서버에 요청하고, 변경된 폴더 정보를 응답받아 상태를 동기화합니다.
	 */
	saveReviewsToFolders: async (reviewId, folderIds) => {
		const { folders } = get();
		const fullFolders = folders.filter(
			(folder) =>
				folderIds.includes(folder.id) &&
				folder.reviewCount >= MAX_REVIEWS_PER_FOLDER && // 용량 초과 확인
				!folder.reviewIds.includes(reviewId), // 중복 확인
		);

		if (fullFolders.length > 0) {
			return { success: false, fullFolders: fullFolders.map((f) => f.name) };
		}

		try {
			// const response = await fetch('/api/review-folders/save', {
			//   method: 'POST',
			//   body: JSON.stringify({ reviewId, folderIds }),
			// });
			// const { updatedFolders } = await response.json();

			// --- Mock API ---
			await new Promise((resolve) => setTimeout(resolve, 300));
			console.log('API CALLED: POST /api/review-folders/save', {
				reviewId,
				folderIds,
			});
			// 실제로는 API 응답으로 받은, reviewCount가 업데이트된 폴더 정보로 상태를 갱신합니다.
			const updatedFolders = get().folders.map((f) =>
				folderIds.includes(f.id) ? { ...f, reviewCount: f.reviewCount + 1 } : f,
			);
			// ---

			// 이유: 클라이언트가 'reviewCount'를 직접 계산하면 다른 기기에서의 변경사항 등을 반영할 수 없어
			// 데이터 정합성이 깨질 수 있습니다. 항상 서버가 계산한 최신 데이터를 받아 상태를 덮어쓰는 것이 안전합니다.
			set((state) => ({
				folders: state.folders.map(
					(oldFolder) =>
						updatedFolders.find((newFolder) => newFolder.id === oldFolder.id) ||
						oldFolder,
				),
			}));

			return { success: true };
		} catch (error) {
			console.error('리뷰 저장 실패:', error);
			return { success: false };
		}
	},
}));
