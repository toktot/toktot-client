'use client';

import { useState } from 'react';

import { MoodKeywordId } from '@/shared/model/types';

export const useMoodFilter = (initialValue: MoodKeywordId[] = []) => {
	const [selectedIds, setSelectedIds] = useState<MoodKeywordId[]>(initialValue);

	const toggleMood = (moodId: MoodKeywordId) => {
		setSelectedIds((prev) => {
			if (moodId === 0) {
				return prev.includes(0 as MoodKeywordId)
					? []
					: ([0] as MoodKeywordId[]);
			}

			// 다른 아이템 선택 시 "전체" 해제
			const withoutAll = prev.filter((id) => id !== 0);

			if (withoutAll.includes(moodId)) {
				// 이미 선택된 아이템을 클릭하면 해제
				return withoutAll.filter((id) => id !== moodId);
			} else {
				// 새로운 아이템 추가
				return [...withoutAll, moodId];
			}
		});
	};

	return { selectedIds, toggleMood };
};
