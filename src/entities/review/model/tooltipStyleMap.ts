import { IconName } from '@/shared/icons/iconMap';

import { TooltipCategory } from './tooltip';

export const tooltipStyleMap: Record<
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
		bgColor: 'bg-yellow-100',
		iconColor: 'white',
	},
	clean: {
		icon: 'Clear',
		bgColor: 'bg-green-100',
		iconColor: 'white',
	},
};
