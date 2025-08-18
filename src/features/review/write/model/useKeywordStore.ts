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
	getFinalKeywords: () => string[];
	clearAllKeywords: () => void;
}

export const useKeywordStore = create<KeywordState & KeywordActions>()(
	(set, get) => ({
		// 모든 카테고리를 포함하도록 초기 상태 확장
		selectedKeywords: {
			food: new Set(),
			cleanliness: new Set(),
			price: new Set(),
			service: new Set(),
			atmosphere: new Set(),
			accessibility: new Set(),
			environment: new Set(),
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

		// 최종 키워드 목록 반환 (ENUM 문자열로)
		getFinalKeywords: () => {
			const { selectedKeywords } = get();
			const finalKeywords: string[] = [];

			for (const category in selectedKeywords) {
				const ids = selectedKeywords[category as KeywordCategory];

				ids.forEach((id) => {
					const enumValue = KEYWORD_ID_TO_ENUM_MAP[id];
					if (enumValue) {
						finalKeywords.push(enumValue);
					}
				});
			}
			return finalKeywords;
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
					environment: new Set(),
				},
			});
		},
	}),
);
