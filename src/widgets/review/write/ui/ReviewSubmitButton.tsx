'use client';

import { useState } from 'react';

import { FoodTooltip, useReviewImageManager } from '@/entities/review';
import { useRouter } from 'next/navigation';

import { createWriteReviewApi } from '@/features/review/write/api/api';
import { type ReviewSubmitPayload } from '@/features/review/write/api/schema';
import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';
import { useReviewWriteStore } from '@/features/review/write/model/useReviewWriteStore';

import { createAuthApi } from '@/shared/api';
import { ReviewImageId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

interface ReviewSubmitButtonProps {
	restaurantId: number;
}

type MinimalImage = { id: string; order: number };

const buildSubmitPayload = (
	restaurantId: number,
	images: MinimalImage[],
): ReviewSubmitPayload => {
	const { tooltips, tooltipsByImageId } = useReviewWriteStore.getState();
	const { mealTime, keywords } = useKeywordStore.getState().getSubmitData();
	const { valueForMoneyScore } = useReviewWriteStore.getState();

	return {
		id: restaurantId,
		keywords: keywords,
		meal_time: mealTime,
		value_for_money_score: valueForMoneyScore ?? 0, // 혹은 null 대신 기본값 결정
		images: images.map((image) => ({
			image_id: image.id,
			order: image.order,
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
						return { ...base, type: 'SERVICE' as const };
					}
					if (tooltip.category === 'clean') {
						return { ...base, type: 'CLEAN' as const };
					}
					return undefined;
				})
				.filter((t): t is NonNullable<typeof t> => Boolean(t)),
		})),
	};
};

export const ReviewSubmitButton = ({
	restaurantId,
}: ReviewSubmitButtonProps) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const imageManager = useReviewImageManager(restaurantId);

	const valueForMoneyScore = useReviewWriteStore(
		(state) => state.valueForMoneyScore,
	);
	const isDisabled = isLoading || valueForMoneyScore === null;

	const getButtonText = () => {
		if (isLoading) return '리뷰 제출 중...';

		return '다음';
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const payload = buildSubmitPayload(restaurantId, imageManager.images);
			console.log('Submitting review payload:', payload);

			const api = createWriteReviewApi(
				createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
			);
			const { review_id } = await api.submitReview(payload);

			useReviewWriteStore.getState().clearAllState();
			useKeywordStore.getState().clearAllKeywords();
			await imageManager.clearImages();

			router.push(`/review/write/complete?reviewId=${review_id}`);
		} catch (error) {
			console.error('Review submission error:', error);
			alert(
				error instanceof Error ? error.message : '리뷰 제출에 실패했습니다.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleSubmit}
			disabled={isDisabled}
			className="w-full p-2 text-primary-40  text-lg font-semibold bg-grey-90 rounded-3xl disabled:bg-grey-50 disabled:text-white disabled:cursor-not-allowed"
			aria-label="리뷰 제출하기"
		>
			{getButtonText()}
		</button>
	);
};
