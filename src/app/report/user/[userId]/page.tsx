'use client';

import { useEffect } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { ReportFormWidget } from '@/widgets/report/ReportFormWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { useReportFormStore } from '@/features/report/model/useReportFormStore';
import { SubmitReportButton } from '@/features/report/ui/SubmitReportButton';

export default function ReportPage() {
	const params = useParams();
	const searchParams = useSearchParams();

	const userId = Number(params.userId);
	const nickname = searchParams.get('nickname') || '알 수 없는 사용자';

	const initializeForm = useReportFormStore((state) => state.initialize);

	useEffect(() => {
		initializeForm('user', userId, nickname);
	}, [initializeForm, userId, nickname]);

	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>사용자 신고</Header.Center>
			</Header>
			<ReportFormWidget />
			<div className="mt-auto sticky p-4 bottom-0">
				<SubmitReportButton />
			</div>
		</AppShell>
	);
}
