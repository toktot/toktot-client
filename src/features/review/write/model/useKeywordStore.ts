import {
	KEYWORD_ID_TO_ENUM_MAP,
	KeywordCategory,
} from '@/entities/keyword/config/data';
import { create } from 'zustand';

import { KeywordId } from '@/shared/model/types';

interface KeywordState {
	selectedKeywords: Record<KeywordCategory, Set<KeywordId>>;
}

interface KeywordActions {
	toggleKeyword: (category: KeywordCategory, keywordId: KeywordId) => void;
	clearAllKeywords: () => void;
	selectSingleKeyword: (
		category: KeywordCategory,
		keywordId: KeywordId,
	) => void;
	getSubmitData: () => { keywords: string[]; mealTime: string };
}

export const useKeywordStore = create<KeywordState & KeywordActions>()(
	(set, get) => ({
		selectedKeywords: {
			food: new Set(),
			cleanliness: new Set(),
			price: new Set(),
			service: new Set(),
			atmosphere: new Set(),
			accessibility: new Set(),
			mealtime: new Set(),
		},

		// 키워드 토글 액션
		toggleKeyword: (category: KeywordCategory, keywordId: KeywordId) => {
			set((state) => {
				const newSelectedKeywords = { ...state.selectedKeywords };
				const categorySet = new Set(newSelectedKeywords[category]);

				if (categorySet.has(keywordId)) {
					categorySet.delete(keywordId);
				} else {
					categorySet.add(keywordId);
				}

				newSelectedKeywords[category] = categorySet;

				return { selectedKeywords: newSelectedKeywords };
			});
		},

		selectSingleKeyword: (category, keywordId) => {
			set((state) => {
				const newSelectedKeywords = { ...state.selectedKeywords };
				const categorySet = new Set<KeywordId>();
				categorySet.add(keywordId);
				newSelectedKeywords[category] = categorySet;

				return { selectedKeywords: newSelectedKeywords };
			});
		},

		getSubmitData: () => {
			const { selectedKeywords } = get();
			const keywords: string[] = [];
			let mealTime: string = '';

			for (const category in selectedKeywords) {
				const typedCategory = category as KeywordCategory;
				const ids = selectedKeywords[typedCategory];

				ids.forEach((id) => {
					if (typedCategory === 'mealtime') {
						mealTime = KEYWORD_ID_TO_ENUM_MAP[id];
					} else {
						const enumValue = KEYWORD_ID_TO_ENUM_MAP[id];
						if (enumValue) {
							keywords.push(enumValue);
						}
					}
				});
			}

			return { keywords, mealTime };
		},

		// 모든 키워드 초기화
		clearAllKeywords: () => {
			set({
				selectedKeywords: {
					food: new Set(),
					cleanliness: new Set(),
					price: new Set(),
					service: new Set(),
					atmosphere: new Set(),
					accessibility: new Set(),
					mealtime: new Set(),
				},
			});
		},
	}),
);

export const selectHasKeywords = (state: KeywordState): boolean => {
	return Object.entries(state.selectedKeywords).some(
		([category, set]) => category != 'mealtime' && set.size > 0,
	);
};

export const selectHasMealTime = (state: KeywordState): boolean => {
	return state.selectedKeywords.mealtime.size > 0;
};
