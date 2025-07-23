import { IconName } from '@/shared/icons/iconMap';

import { TooltipCategory } from './tooltip';

export const tooltipMarkerStyleMap: Record<
	TooltipCategory,
	{
		icon: IconName;
		bgColor: string; // 배경색 (Tailwind class)
		iconColor: string; // 아이콘 색상
	}
> = {
	food: {
		icon: 'KoreanDish',
		bgColor: 'bg-primary-50',
		iconColor: 'white',
	},
	service: {
		icon: 'Service',
		bgColor: 'bg-sub-orange-50',
		iconColor: 'white',
	},
	clean: {
		icon: 'Clear',
		bgColor: 'bg-sub-green-50',
		iconColor: 'white',
	},
};

export const RATING_ICON_COLOR_FOR_CATEGORY = {
	food: '#3AC8FF',
	service: '#FF893A',
	clean: '#1AA96E',
};
