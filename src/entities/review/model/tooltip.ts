interface BaseTooltip {
	id: string;
	x: number;
	y: number;
	category: TooltipCategory;
	description?: string;
}

export type TooltipCategory = 'food' | 'service' | 'clean';

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
