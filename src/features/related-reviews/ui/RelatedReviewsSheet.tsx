'use client';

import { useState } from 'react';

import { TooltipCategory } from '@/entities/review';
import { useInfiniteStoreReviews } from '@/entities/review/api/useInfiniteStoreReviews';
import { ReviewDetailItem } from '@/entities/review/ui/ReviewDetailItem';

import { StoreId } from '@/shared/model/types';

import { ReviewCategorySelector } from './ReviewCategorySelector';

interface RelatedReviewsSheetProps {
	storeId: StoreId;
}

//TODO: 카테고리 별 리뷰 조회
export const RelatedReviewsSheet = ({ storeId }: RelatedReviewsSheetProps) => {
	const [selectedCategory, setSelectedCategory] =
		useState<TooltipCategory>('food');

	const { data: reviews, isLoading } = useInfiniteStoreReviews(storeId);

	const handleCategoryChange = (category: TooltipCategory) => {
		setSelectedCategory(category);
	};

	return (
		<div className="flex h-full flex-col -mx-2">
			<hr className="border-grey-20" />
			<ReviewCategorySelector
				selectedCategory={selectedCategory}
				onCategoryChange={handleCategoryChange}
				className="my-3 px-4"
			/>
			<hr className="border-grey-20" />
			{/* 리뷰 리스트 */}
			<div className="flex-1 min-h-fit px-4 bg-[#F2FAFE] overflow-y-auto [&::-webkit-scrollbar]:hidden">
				<hr className="border-grey-20 -mx-4" />
				<div className="h-[25vh]">
					{isLoading && <div className="p-4 text-center">로딩 중...</div>}
					{!isLoading &&
						reviews.map((review) => (
							<div key={review.id}>
								<ReviewDetailItem review={review} />
								<hr className="border-grey-20 -mx-4" />
							</div>
						))}
				</div>
			</div>

			{/* TODO: 무한 스크롤 트리거 추가 */}
		</div>
	);
};
