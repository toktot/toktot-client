import { useState } from 'react';

import { Tooltip, TooltipCategory } from '@/entities/review/model/tooltip';
import { nanoid } from 'nanoid';

import { FinalReviewData } from '@/widgets/review/write/ui/CreateReviewSheet';

import { TooltipId } from '@/shared/model/types';

export function useTooltipManager(
	initialTooltips: Record<TooltipId, Tooltip> = {},
) {
	const [tooltips, setTooltips] =
		useState<Record<TooltipId, Tooltip>>(initialTooltips);

	const addTooltip = (newTooltipData: Omit<Tooltip, 'id'>) => {
		const id = nanoid() as TooltipId;
		const newTooltip: Tooltip = { ...newTooltipData, id } as Tooltip;
		setTooltips((prev) => ({ ...prev, [id]: newTooltip }));

		return newTooltip;
	};

	/**
	 * 툴팁의 세부 정보를 업데이트합니다. (폼 완료 시 사용)
	 */
	const updateTooltipDetails = (id: TooltipId, formData: FinalReviewData) => {
		setTooltips((prev) => {
			const existing = prev[id];
			if (!existing) return prev;

			let newTooltip: Tooltip;
			// ... (이전 updateTooltip의 Case 1 로직과 동일)
			switch (formData.category) {
				case 'food':
					if (formData.formData && 'menuName' in formData.formData) {
						newTooltip = {
							...existing,
							category: 'food',
							rating: formData.rating,
							description: formData.detailedText,
							menuName: formData.formData.menuName,
							price: formData.formData.price,
						};
					} else {
						return prev;
					}
					break;
				case 'service':
					newTooltip = {
						...existing,
						category: 'service',
						rating: formData.rating,
						description: formData.detailedText,
					};
					break;
				case 'clean':
					newTooltip = {
						...existing,
						category: 'clean',
						rating: formData.rating,
						description: formData.detailedText,
					};
					break;
				default:
					return prev;
			}
			return { ...prev, [id]: newTooltip };
		});
	};

	/**
	 * 툴팁의 카테고리를 변경합니다.
	 * 카테고리 변경 시, 해당 카테고리에 맞지 않는 속성은 초기화됩니다.
	 */
	const changeTooltipCategory = (id: TooltipId, category: TooltipCategory) => {
		setTooltips((prev) => {
			const existing = prev[id];
			if (!existing || existing.category === category) return prev;

			const base = {
				id: existing.id,
				x: existing.x,
				y: existing.y,
				rating: 0,
				description: '',
			};
			let newTooltip: Tooltip;

			switch (category) {
				case 'food':
					newTooltip = { ...base, category: 'food', menuName: '', price: 0 };
					break;
				case 'service':
					newTooltip = { ...base, category: 'service' };
					break;
				case 'clean':
					newTooltip = { ...base, category: 'clean' };
					break;
				default:
					newTooltip = existing;
					break;
			}
			return { ...prev, [id]: newTooltip };
		});
	};

	const removeTooltip = (id: TooltipId) => {
		setTooltips((prev) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [id]: _, ...rest } = prev;

			return rest;
		});
	};

	return {
		tooltips,
		addTooltip,
		updateTooltipDetails,
		changeTooltipCategory,
		removeTooltip,
	};
}
