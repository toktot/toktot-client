import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';

import { createStoreSearchApi } from '../api/api';
import { PlaceClient } from '../api/schema';

interface StoreSearchState {
	query: string;
	suggestions: PlaceClient[];
	results: PlaceClient[];
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	isEnd: boolean;
}

interface StoreSearchActions {
	setQuery: (query: string) => void;
	fetchSuggestions: () => Promise<void>;
	searchStores: (isNewSearch?: boolean) => Promise<void>;
	clearSuggestions: () => void;
	clearResults: () => void;
}

export const api = createStoreSearchApi(
	createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
);

const initialState: StoreSearchState = {
	query: '',
	suggestions: [],
	results: [],
	isLoading: false,
	error: null,
	currentPage: 1,
	isEnd: false,
};

export const useStoreSearch = create<StoreSearchState & StoreSearchActions>()(
	immer((set, get) => ({
		...initialState,

		setQuery: (query) => {
			set({ query });
		},

		fetchSuggestions: async () => {
			const { query } = get();
			if (!query.trim()) {
				set({ suggestions: [] });
				return;
			}
			set({ isLoading: true, error: null });
			try {
				const data = await api.searchStores({ query, page: 1 });
				set({ suggestions: data.places });
			} catch (e) {
				set({ error: e instanceof Error ? e.message : 'An error occurred' });
			} finally {
				set({ isLoading: false });
			}
		},

		searchStores: async (isNewSearch = false) => {
			const { query, currentPage, isEnd, isLoading, results } = get();

			if (!query.trim() || isLoading || (isEnd && !isNewSearch)) return;

			set({ isLoading: true, error: null });

			const pageToFetch = isNewSearch ? 1 : currentPage;

			try {
				const data = await api.searchStores({ query, page: pageToFetch });
				set((state) => {
					if (isNewSearch) {
						state.results = data.places;
					} else {
						const existingIds = new Set(results.map((p) => p.id));
						const newPlaces = data.places.filter((p) => !existingIds.has(p.id));
						state.results.push(...newPlaces);
					}
					state.currentPage = data.currentPage + 1;
					state.isEnd = data.isEnd;
				});
			} catch (e) {
				set({ error: e instanceof Error ? e.message : 'An error occurred' });
			} finally {
				set({ isLoading: false });
			}
		},

		clearSuggestions: () => {
			set({ suggestions: [] });
		},

		clearResults: () => {
			set({ results: [], currentPage: 1, isEnd: false });
		},
	})),
);
