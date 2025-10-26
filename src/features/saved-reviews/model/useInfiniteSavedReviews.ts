'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { getSavedReviewsInFolder } from '../api/api';
import { SavedReview } from '../api/schema';

interface SavedReviewsState {
	reviews: SavedReview[];
	page: number;
	isLoading: boolean;
	hasMore: boolean;
	error: string | null;
}

interface SavedReviewsActions {
	loadMoreReviews: (folderId: number) => Promise<void>;
	removeReview: (reviewId: number) => void;
	reset: () => void;
}

const initialState: SavedReviewsState = {
	reviews: [],
	page: 0,
	isLoading: false,
	hasMore: true,
	error: null,
};

export const useInfiniteSavedReviews = create<SavedReviewsState & SavedReviewsActions>()(
	immer((set, get) => ({
		...initialState,
		loadMoreReviews: async (folderId) => {
			const { isLoading, hasMore, page } = get();
			if (isLoading || !hasMore) return;

			set({ isLoading: true, error: null });

			try {
				const data = await getSavedReviewsInFolder(folderId, page);
				set((state) => {
					const existingIds = new Set(state.reviews.map((r) => r.id));
					const newReviews = data.content.filter((r) => !existingIds.has(r.id));
					state.reviews.push(...newReviews);
					state.hasMore = !data.last;
					state.page += 1;
				});
			} catch (err) {
				set({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
			} finally {
				set({ isLoading: false });
			}
		},
		removeReview: (reviewId) => {
			set((state) => {
				state.reviews = state.reviews.filter((r) => r.id !== reviewId);
			});
		},
		reset: () => {
			set(initialState);
		},
	})),
);
