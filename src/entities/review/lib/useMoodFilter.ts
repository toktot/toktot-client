'use client';

import { useState } from 'react';

export const useMoodFilter = (initialValue: number[] = []) => {
	const [selectedIds, setSelectedIds] = useState<number[]>(initialValue);

	const toggleMood = (moodId: number) => {
		setSelectedIds((prev) => {
			// "전체" (id: 0) 선택 시 특별 처리
			if (moodId === 0) {
				return prev.includes(0) ? [] : [0];
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
