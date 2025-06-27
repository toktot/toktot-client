import { useState } from 'react';

import { MAX_TOOLTIP_COUNT } from '@/entities/review/model/constants';
import { Tooltip } from '@/entities/review/model/tooltip';
import { nanoid } from 'nanoid';

export function useTooltipManager() {
	const [tooltips, setTooltips] = useState<Tooltip[]>([]);

	const addTooltip = (tooltip: Omit<Tooltip, 'id'>) => {
		if (tooltips.length >= MAX_TOOLTIP_COUNT) {
			alert('최대 5개까지만 등록할 수 있습니다.');
			return;
		}
		const newTooltip = { ...tooltip, id: nanoid() } as Tooltip;

		setTooltips((prev) => [...prev, newTooltip]);
	};

	const removeTooltip = (id: string) => {
		setTooltips((prev) => prev.filter((t) => t.id !== id));
	};

	return { tooltips, addTooltip, removeTooltip };
}
