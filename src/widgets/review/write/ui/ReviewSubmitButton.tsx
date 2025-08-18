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
	const finalKeywords = useKeywordStore.getState().getFinalKeywords();

	return {
		restaurant_id: restaurantId,
		keywords: finalKeywords,
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

	const hasImages = imageManager.images.length > 0;

	const keywordStore = useKeywordStore();

	const hasKeywords = keywordStore.getFinalKeywords().length > 0;
	const isDisabled = isLoading || !hasImages || !hasKeywords;

	const getButtonText = () => {
		if (isLoading) return '리뷰 제출 중...';
		if (!hasImages) return '이미지를 등록해주세요';
		if (!hasKeywords) return '키워드를 선택해주세요';
		return '다음';
	};

	const handleSubmit = async () => {
		const selectedKeywords = useKeywordStore.getState().getFinalKeywords();
		if (imageManager.images.length === 0) {
			alert('이미지를 1장 이상 등록해주세요.');
			return;
		}
		if (selectedKeywords.length === 0) {
			alert('키워드를 1개 이상 선택해주세요.');
			return;
		}

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
			aria-label="리뷰 저장하기"
		>
			{getButtonText()}
		</button>
	);
};
