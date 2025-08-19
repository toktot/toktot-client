'use client';

import { PrivacyAgreementCheckbox } from '@/features/report/ui/PrivacyAgreementCheckbox';
import { ReportDetailInput } from '@/features/report/ui/ReportDetailInput';
import { ReportReasonSelector } from '@/features/report/ui/ReportReasonSelector';
import { ReportTargetDisplay } from '@/features/report/ui/ReportTargetDisplay';

export const ReportFormWidget = () => {
	return (
		<div className="w-full flex flex-col items-center p-4 gap-8">
			<ReportTargetDisplay />
			<ReportReasonSelector />
			<ReportDetailInput />
			<PrivacyAgreementCheckbox />
		</div>
	);
};
