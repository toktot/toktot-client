'use client';

import { ReviewView } from '@/entities/review';
import { mapReviewContentToView } from '@/entities/review/api/mappers';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthApi } from '@/shared/api';
import { ReviewId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createReviewFeedApi } from '../api/reviewFeedApi';
import { ReviewSearchRequest } from '../api/schema';

const api = createReviewFeedApi(
	createAuthApi({
		getToken: () => getDecryptedToken() ?? undefined,
	}),
);

interface ReviewFeedState {
	reviews: ReviewView[];
	page: number;
	isLoading: boolean;
	hasNextPage: boolean;
	filters: ReviewSearchRequest;
	setFilters: (newFilters: ReviewSearchRequest) => void;
	initializeFeed: () => Promise<void>;
	fetchNextPage: () => Promise<void>;
	updateBookmarkStatus: (reviewId: ReviewId, isBookmarked: boolean) => void;
}

export const useReviewFeedStore = create<ReviewFeedState>()(
	immer((set, get) => ({
		reviews: [],
		page: 0,
		isLoading: false,
		hasNextPage: true,
		filters: {},

		setFilters: (newFilters) => {
			set({ filters: newFilters });
			get().initializeFeed();
		},

		initializeFeed: async () => {
			const { filters } = get();
			set({ isLoading: true, reviews: [], page: 0, hasNextPage: true });
			try {
				const response = await api.searchReviews(filters, 0, 10);
				const reviewViews = response.content.map(mapReviewContentToView);
				set({
					reviews: reviewViews,
					hasNextPage: !response.last,
					page: 1,
				});
			} catch (error) {
				console.error('Error initializing review feed:', error);
				set({ hasNextPage: false });
			} finally {
				set({ isLoading: false });
			}
		},

		fetchNextPage: async () => {
			const { filters, page, isLoading, hasNextPage } = get();
			if (isLoading || !hasNextPage) return;

			set({ isLoading: true });
			try {
				const response = await api.searchReviews(filters, page, 10);
				const newReviewViews = response.content.map(mapReviewContentToView);
				set((state) => ({
					reviews: [...state.reviews, ...newReviewViews],
					hasNextPage: !response.last,
					page: state.page + 1,
				}));
			} catch (error) {
				console.error('Error fetching next page of review feed:', error);
				set({ hasNextPage: false });
			} finally {
				set({ isLoading: false });
			}
		},

		updateBookmarkStatus: (reviewId, isBookmarked) => {
			set((state) => {
				const review = state.reviews.find((r) => r.id === reviewId);
				if (review) {
					review.isBookmarked = isBookmarked;
				}
			});
		},
	})),
);
