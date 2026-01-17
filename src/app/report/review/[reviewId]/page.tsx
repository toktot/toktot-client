'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { ReportReviewWidget } from '@/widgets/report/review/ui/ReportReviewWidget';

import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { useReviewReportStore } from '@/features/report/model/useReviewReportStore';
import { SubmitReviewReportButton } from '@/features/report/review/ui/SubmitReviewReportButton';

import { ReviewId } from '@/shared/model/types';

export default function ReportReviewPage() {
	const params = useParams();
	const reviewId = params.reviewId as ReviewId;

	const initializeForm = useReviewReportStore((state) => state.initialize);

	useEffect(() => {
		if (reviewId) {
			initializeForm(reviewId);
		}
	}, [initializeForm, reviewId]);

	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 신고</Header.Center>
			</Header>
			<ReportReviewWidget />
			<div className="mt-auto sticky p-4 bottom-0">
				<SubmitReviewReportButton />
			</div>
		</AppShell>
	);
}
