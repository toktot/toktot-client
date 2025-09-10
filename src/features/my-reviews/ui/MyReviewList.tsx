'use client';

import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

import { useInfiniteMyReviews } from '../model/useInfiniteMyReviews';
import { MyReviewCard } from './MyReviewCard';

export const MyReviewList = () => {
	const { reviews, isLoading, hasMore, error, loadMoreReviews } =
		useInfiniteMyReviews();

	const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
		isLoading,
		hasMore,
		onLoadMore: loadMoreReviews,
	});

	if (error) {
		return <div className="p-4 text-sub-red-50">에러: {error}</div>;
	}

	return (
		<div className="p-4">
			<div className="grid grid-cols-2 gap-4">
				{reviews.map((review) => (
					<MyReviewCard key={review.id} review={review} />
				))}
			</div>
			<div ref={loadMoreRef} className="h-10" />
			{isLoading && <div className="text-center p-4">로딩 중...</div>}
			{!isLoading && reviews.length === 0 && (
				<div className="text-center p-10 text-grey-500">
					작성한 리뷰가 없습니다.
				</div>
			)}
		</div>
	);
};
