import { FoodTooltip } from '@/entities/review';
import { useReviewImageStore } from '@/entities/review/lib/useReviewImageManager';

import { type ReviewSubmitPayload } from '@/features/review/write/api/schema';
import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';
import { useReviewWriteStore } from '@/features/review/write/model/useReviewWriteStore';

import { ReviewImageId } from '@/shared/model/types';

type MinimalImage = { id: string; order: number };

export const buildSubmitPayload = (
	restaurantId: number,
	images: MinimalImage[],
): ReviewSubmitPayload => {
	const { tooltips, tooltipsByImageId } = useReviewWriteStore.getState();
	const { mealTime, keywords } = useKeywordStore.getState().getSubmitData();
	const { valueForMoneyScore } = useReviewWriteStore.getState();
	const { mainImageId } = useReviewImageStore.getState();

	return {
		id: restaurantId.toString(),
		keywords: keywords,
		meal_time: mealTime,
		value_for_money_score: valueForMoneyScore ?? 0,
		images: images.map((image) => ({
			image_id: image.id,
			order: image.order,
			is_main: image.id === mainImageId,
			tooltips: (tooltipsByImageId[image.id as ReviewImageId] || [])
				.map((tooltipId) => {
					const tooltip = tooltips[tooltipId];
					if (!tooltip) return undefined;
					const base = {
						x: tooltip.x,
						y: tooltip.y,
						rating: tooltip.rating,
						detailed_review: tooltip.description,
					};

					if (tooltip.category === 'food') {
						const foodTooltip = tooltip as FoodTooltip;
						return {
							...base,
							type: 'FOOD' as const,
							menu_name: foodTooltip.menuName,
							total_price: foodTooltip.price,
							serving_size: foodTooltip.servings,
						};
					}
					if (tooltip.category === 'service') {
						return {
							...base,
							type: 'SERVICE' as const,
							serving_size: null,
						};
					}
					if (tooltip.category === 'clean') {
						return {
							...base,
							type: 'CLEAN' as const,
							serving_size: null,
						};
					}
					return undefined;
				})
				.filter((t): t is NonNullable<typeof t> => Boolean(t)),
		})),
	};
};
