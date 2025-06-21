import { useState } from 'react';

import { Tooltip } from '@/entities/review/model/tooltip';
import { nanoid } from 'nanoid';

export function useTooltipManager() {
	const [tooltips, setTooltips] = useState<Tooltip[]>([]);

	const addTooltip = (tooltip: Omit<Tooltip, 'id'>) => {
		const newTooltip = { ...tooltip, id: nanoid() } as Tooltip;

		setTooltips((prev) => [...prev, newTooltip]);
	};

	const removeTooltip = (id: string) => {
		setTooltips((prev) => prev.filter((t) => t.id !== id));
	};

	return { tooltips, addTooltip, removeTooltip };
}
