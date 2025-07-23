import { TooltipCategory } from '@/entities/review/model/tooltip';

import { IconName } from '@/shared/icons/iconMap';

export const RATING_ICON_FOR_CATEGORY = (
	category: TooltipCategory,
): IconName => {
	switch (category) {
		case 'food':
			return 'Star';
		case 'service':
			return 'Service';
		case 'clean':
			return 'Clear';
		default:
			return 'Star';
	}
};
