import { useState } from 'react';

import { Tooltip } from '@/entities/review/model/tooltip';
import { nanoid } from 'nanoid';

export function useTooltipManager(
	initialTooltips: Record<string, Tooltip> = {},
) {
	const [tooltips, setTooltips] =
		useState<Record<string, Tooltip>>(initialTooltips);

	const addTooltip = (newTooltipData: Omit<Tooltip, 'id'>) => {
		const id = nanoid();
		const newTooltip: Tooltip = { ...newTooltipData, id } as Tooltip;
		setTooltips((prev) => ({ ...prev, [id]: newTooltip }));

		return newTooltip;
	};

	function updateTooltip(
		id: string,
		data: Partial<Omit<Extract<Tooltip, { category: 'food' }>, 'id'>>,
	): void;
	function updateTooltip(
		id: string,
		data: Partial<Omit<Extract<Tooltip, { category: 'service' }>, 'id'>>,
	): void;
	function updateTooltip(
		id: string,
		data: Partial<Omit<Extract<Tooltip, { category: 'clean' }>, 'id'>>,
	): void;

	function updateTooltip(
		id: string,
		data:
			| Partial<Omit<Extract<Tooltip, { category: 'food' }>, 'id'>>
			| Partial<Omit<Extract<Tooltip, { category: 'service' }>, 'id'>>
			| Partial<Omit<Extract<Tooltip, { category: 'clean' }>, 'id'>>,
	): void {
		setTooltips((prev) => {
			const existing = prev[id];
			if (!existing) return prev;

			switch (existing.category) {
				case 'food': {
					const foodData = data as Partial<
						Omit<Extract<Tooltip, { category: 'food' }>, 'id'>
					>;
					return { ...prev, [id]: { ...existing, ...foodData } };
				}
				case 'service': {
					const serviceData = data as Partial<
						Omit<Extract<Tooltip, { category: 'service' }>, 'id'>
					>;
					return { ...prev, [id]: { ...existing, ...serviceData } };
				}
				case 'clean': {
					const cleanData = data as Partial<
						Omit<Extract<Tooltip, { category: 'clean' }>, 'id'>
					>;
					return { ...prev, [id]: { ...existing, ...cleanData } };
				}
			}
		});
	}

	const removeTooltip = (id: string) => {
		setTooltips((prev) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [id]: _, ...rest } = prev;

			return rest;
		});
	};

	return { tooltips, addTooltip, updateTooltip, removeTooltip };
}
