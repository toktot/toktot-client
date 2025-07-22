export const CATEGORY_MAP = {
	0: 'food',
	1: 'service',
	2: 'clean',
} as const;

export const REVERSE_CATEGORY_MAP: Record<TooltipCategory, number> = {
	food: 0,
	service: 1,
	clean: 2,
};

export type CategoryMap = typeof CATEGORY_MAP;
export type CategoryKey = keyof CategoryMap;
export type TooltipCategory = CategoryMap[CategoryKey]; // 'food' | 'service' | 'clean'

interface BaseTooltip {
	id: string;
	x: number;
	y: number;
	category: TooltipCategory;
	rating: number;

	description?: string;
}

interface FoodTooltip extends BaseTooltip {
	category: 'food';
	menuName: string;
	price: number;
}

interface ServiceTooltip extends BaseTooltip {
	category: 'service';
}

interface CleanTooltip extends BaseTooltip {
	category: 'clean';
}

export type Tooltip = FoodTooltip | ServiceTooltip | CleanTooltip;
