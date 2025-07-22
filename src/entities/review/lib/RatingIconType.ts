import { TooltipCategory } from '@/entities/review/model/tooltip';

import { IconName } from '@/shared/icons/iconMap';

export const mapCategoryToIconType = (category: TooltipCategory): IconName => {
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
