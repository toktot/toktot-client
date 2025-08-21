'use client';

import { useReviewReportStore } from '@/features/report/model/useReviewReportStore';
import { ReporterTypeSelector } from '@/features/report/review/ui/ReporterTypeSelector';
import { ReviewReportReasonSelector } from '@/features/report/review/ui/ReviewReportReasonSelector';
import { PrivacyAgreementCheckbox } from '@/features/report/ui/PrivacyAgreementCheckbox';
import { ReportDetailInput } from '@/features/report/ui/ReportDetailInput';

export const ReportReviewWidget = () => {
	const detailedContent = useReviewReportStore(
		(state) => state.detailedContent,
	);

	const setDetailedContent = useReviewReportStore(
		(state) => state.setDetailedContent,
	);
	const isPrivacyAgreed = useReviewReportStore(
		(state) => state.isPrivacyAgreed,
	);
	const setPrivacyAgreed = useReviewReportStore(
		(state) => state.setPrivacyAgreed,
	);
	return (
		<div className="w-full flex flex-col items-center p-4 gap-8">
			<ReporterTypeSelector />
			<ReviewReportReasonSelector />
			<ReportDetailInput
				value={detailedContent}
				onChange={setDetailedContent}
			/>
			<PrivacyAgreementCheckbox
				checked={isPrivacyAgreed}
				onChange={setPrivacyAgreed}
			/>
		</div>
	);
};
