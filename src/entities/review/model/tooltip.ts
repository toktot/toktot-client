import { TooltipId } from '@/shared/model/types';

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

export const CATEGORY_LABEL_MAP: Record<TooltipCategory, string> = {
	food: '음식',
	service: '서비스',
	clean: '청결',
};

export type CategoryMap = typeof CATEGORY_MAP;
export type CategoryKey = keyof CategoryMap;
export type TooltipCategory = CategoryMap[CategoryKey]; // 'food' | 'service' | 'clean'

interface BaseTooltip {
	id: TooltipId;
	x: number;
	y: number;
	category: TooltipCategory;
	rating: number;

	description?: string;
}

export interface FoodTooltip extends BaseTooltip {
	category: 'food';
	menuName: string;
	price: number;
	servings: number;
}

export interface ServiceTooltip extends BaseTooltip {
	category: 'service';
}

export interface CleanTooltip extends BaseTooltip {
	category: 'clean';
}

export type Tooltip = FoodTooltip | ServiceTooltip | CleanTooltip;
