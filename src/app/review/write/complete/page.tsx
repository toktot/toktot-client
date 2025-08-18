import { Suspense } from 'react';

import { AppShell, Header } from '@/widgets/layout';
import { WriteCompleteWidget } from '@/widgets/review/write/ui/WriteCompleteWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

import { ReviewId } from '@/shared/model/types';

const CompletionPageContent = ({
	reviewId,
}: {
	reviewId: ReviewId | undefined;
}) => {
	if (!reviewId) {
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
		<Suspense
			fallback={
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<span className="ml-2 text-gray-600">Loading...</span>
				</div>
			}
		>
			<AppShell showBottomNav={false}>
				<Header>
					<Header.Left>
						<BackButton />
					</Header.Left>
					<Header.Center>리뷰 쓰기</Header.Center>
				</Header>
				<div className="flex flex-col items-center flex-1 justify-center p-4">
					<CompletionPageContent reviewId={reviewId} />
				</div>
			</AppShell>
		</Suspense>
	);
}
