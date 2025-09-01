'use client';

import { useReviewImageManager } from '@/entities/review/lib/useReviewImageManager';
import { useRouter } from 'next/navigation';

import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';

import { StoreId } from '@/shared/model/types';

export const NextButton = ({ restaurantId }: { restaurantId: number }) => {
	const router = useRouter();

	const imageManager = useReviewImageManager(String(restaurantId) as StoreId);

	const hasImages = imageManager.images.length > 0;

	const keywordStore = useKeywordStore();

	const { mealTime, keywords } = keywordStore.getSubmitData();
	const hasKeywords = keywords.length > 0;

	const hasMealTime = Boolean(mealTime);

	const isDisabled = !hasImages || !hasKeywords || !hasMealTime;

	const getButtonText = () => {
		if (!hasImages) return '이미지를 등록해주세요';
		if (!hasKeywords) return '키워드를 선택해주세요';
		if (!hasMealTime) return '식사시간을 선택해주세요';
		return '다음';
	};

	const handleNext = async () => {
		if (imageManager.images.length === 0) {
			alert('이미지를 1장 이상 등록해주세요.');
			return;
		}

		try {
			router.push(`/review/write/${restaurantId}/value-score`);
		} catch (error) {
			console.error('Review submission error:', error);
			alert(
				error instanceof Error ? error.message : '리뷰 제출에 실패했습니다.',
			);
		}
	};

	return (
		<button
			onClick={handleNext}
			disabled={isDisabled}
			className="w-full p-2 text-primary-40  text-lg font-semibold bg-grey-90 rounded-3xl disabled:bg-grey-50 disabled:text-white disabled:cursor-not-allowed"
		>
			{getButtonText()}
		</button>
	);
};
