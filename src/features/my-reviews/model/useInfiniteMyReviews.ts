'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { deleteMyReview, getMyReviews } from '../api/api';
import { MyReview } from '../api/schema';

interface MyReviewsState {
	reviews: MyReview[];
	page: number;
	isLoading: boolean;
	hasMore: boolean;
	error: string | null;
	initialized: boolean;
}

interface MyReviewsActions {
	loadMoreReviews: () => Promise<void>;
	deleteReview: (reviewId: number) => Promise<void>;
}

const initialState: MyReviewsState = {
	reviews: [],
	page: 0,
	isLoading: false,
	hasMore: true,
	error: null,
	initialized: false,
};

export const useInfiniteMyReviewsStore = create<MyReviewsState & MyReviewsActions>()(
	immer((set, get) => ({
		...initialState,

		loadMoreReviews: async () => {
			const { isLoading, hasMore, page } = get();
			if (isLoading || !hasMore) return;

			set({ isLoading: true, error: null });

			try {
				const data = await getMyReviews(page);
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
				set({ isLoading: false, initialized: true });
			}
		},

		deleteReview: async (reviewId: number) => {
			// Optimistic UI Update
			const previousReviews = get().reviews;
			set((state) => {
				state.reviews = state.reviews.filter((r) => r.id !== reviewId);
			});

			try {
				await deleteMyReview(reviewId);
			} catch (error) {
				// Revert on error
				set({ reviews: previousReviews });
				throw error; // Re-throw for the component to catch
			}
		},
	})),
);
