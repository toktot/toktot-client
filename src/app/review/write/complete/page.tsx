import { Suspense } from 'react';

import { WriteCompleteWidget } from '@/widgets/review/write/ui/WriteCompleteWidget';

import { ReviewId } from '@/shared/model/types';

// URL 쿼리 파라미터(예: ?reviewId=123)를 처리하기 위한 컴포넌트
const CompletionPageContent = ({
	reviewId,
}: {
	reviewId: ReviewId | undefined;
}) => {
	if (!reviewId) {
		// reviewId가 없는 예외적인 상황 처리
		return (
			<div className="text-center p-8">
				<div className="bg-red-50 border text-sub-red-0 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-red-800 mb-2">오류</h2>
					<p className="text-sub-red-30">
						작성된 리뷰 정보를 찾을 수 없습니다.
					</p>
				</div>
			</div>
		);
	}

	return <WriteCompleteWidget newReviewId={reviewId} />;
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ReviewWriteCompletePage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;
	const reviewId = (
		typeof resolvedSearchParams.reviewId === 'string'
			? resolvedSearchParams.reviewId
			: undefined
	) as ReviewId | undefined;

	return (
		<main className="flex items-center justify-center min-h-screen bg-gray-50">
			<Suspense
				fallback={
					<div className="flex items-center justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
						<span className="ml-2 text-gray-600">Loading...</span>
					</div>
				}
			>
				<CompletionPageContent reviewId={reviewId} />
			</Suspense>
		</main>
	);
}
