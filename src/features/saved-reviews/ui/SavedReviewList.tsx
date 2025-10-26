'use client';

import { useEffect } from 'react';

import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

import { useInfiniteSavedReviews } from '../model/useInfiniteSavedReviews';
import { SavedReviewCard } from './SavedReviewCard';

interface SavedReviewListProps {
	folderId: number;
}

export const SavedReviewList = ({ folderId }: SavedReviewListProps) => {
	const {
		reviews,
		isLoading,
		hasMore,
		error,
		loadMoreReviews,
		reset,
	} = useInfiniteSavedReviews();

	useEffect(() => {
		reset();
	}, [reset]);

	const loadMoreRef = useInfiniteScroll<HTMLDivElement>({
		isLoading,
		hasMore,
		onLoadMore: () => loadMoreReviews(folderId),
	});

	if (error) {
		return <div className="p-4 text-sub-red-50">에러: {error}</div>;
	}

	return (
		<div className="p-4">
			<div className="grid grid-cols-2 gap-4">
				{reviews.map((review) => (
					<SavedReviewCard key={review.id} review={review} folderId={folderId} />
				))}
			</div>
			<div ref={loadMoreRef} className="h-10" />
			{isLoading && <div className="text-center p-4">로딩 중...</div>}
			{!isLoading && reviews.length === 0 && (
				<div className="text-center p-10 text-grey-500">
					저장된 리뷰가 없습니다.
				</div>
			)}
		</div>
	);
};
