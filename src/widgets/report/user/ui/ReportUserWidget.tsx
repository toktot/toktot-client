'use client';

import { useUserReportStore } from '@/features/report/model/useUserReportStore';
import { PrivacyAgreementCheckbox } from '@/features/report/ui/PrivacyAgreementCheckbox';
import { ReportDetailInput } from '@/features/report/ui/ReportDetailInput';
import { ReportTargetDisplay } from '@/features/report/user/ui/ReportTargetDisplay';
import { UserReportReasonSelector } from '@/features/report/user/ui/UserReportReasonSelector';

export const ReportFormWidget = () => {
	const detailedContent = useUserReportStore((state) => state.detailedContent);
	const setDetailedContent = useUserReportStore(
		(state) => state.setDetailedContent,
	);
	const isPrivacyAgreed = useUserReportStore((state) => state.isPrivacyAgreed);
	const setPrivacyAgreed = useUserReportStore(
		(state) => state.setPrivacyAgreed,
	);

	return (
		<div className="w-full flex flex-col items-center p-4 gap-8">
			<ReportTargetDisplay />
			<UserReportReasonSelector />
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
