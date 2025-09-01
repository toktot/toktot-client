'use client';

import { useState } from 'react';

import { ReviewView } from '@/entities/review';
import { TooltipCategory } from '@/entities/review';
import { useInfiniteStoreReviews } from '@/entities/review/api/useInfiniteStoreReviews';
import { ReviewDetailItem } from '@/entities/review/ui/ReviewDetailItem';

import { StoreId } from '@/shared/model/types';

import { ReviewCategorySelector } from './ReviewCategorySelector';

interface RelatedReviewsSheetProps {
	clickedReview: ReviewView;
	storeId: StoreId;
}

//TODO: 카테고리 별 리뷰 조회
export const RelatedReviewsSheet = ({
	// clickedReview,
	storeId,
}: RelatedReviewsSheetProps) => {
	const [selectedCategory, setSelectedCategory] =
		useState<TooltipCategory>('food');

	const { data: reviews, isLoading } = useInfiniteStoreReviews(storeId);

	const handleCategoryChange = (category: TooltipCategory) => {
		setSelectedCategory(category);
	};

	return (
		<div className="flex h-full flex-col">
			{/* TODO: 카테고리 별 리뷰 개수 표시 */}
			<>
				<ReviewCategorySelector
					selectedCategory={selectedCategory}
					onCategoryChange={handleCategoryChange}
					className="my-3 px-4"
				/>
				<hr className="border-grey-20" />
			</>
			{/* 리뷰 리스트 */}
			<div className="px-4 bg-slate-50 max-h-[30vh] overflow-y-auto">
				{/* <ReviewDetailItem review={clickedReview} isSelected /> */}
				<hr className="border-grey-20 -mx-4" />
				{isLoading && <div className="p-4 text-center">로딩 중...</div>}
				{!isLoading &&
					reviews.map((review) => (
						<div key={review.id}>
							<ReviewDetailItem review={review} />
							<hr className="border-grey-20 -mx-4" />
						</div>
					))}
			</div>

			{/* TODO: 무한 스크롤 트리거 추가 */}
		</div>
	);
};
