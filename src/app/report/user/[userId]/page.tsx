'use client';

import { useEffect } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';
import { ReportFormWidget } from '@/widgets/report/user/ui/ReportUserWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { useUserReportStore } from '@/features/report/model/useUserReportStore';
import { SubmitUserReportButton } from '@/features/report/ui/SubmitUserReportButton';

import { UserId } from '@/shared/model/types';

export default function ReportPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const userIdParam = Array.isArray(params.userId)
		? params.userId[0]
		: params.userId;
	const userIdAsNumber = Number(userIdParam);
	const userId = userIdAsNumber as UserId;
	const nickname = searchParams.get('nickname') || '알 수 없는 사용자';

	const initializeForm = useUserReportStore((state) => state.initialize);

	useEffect(() => {
		initializeForm(userId, nickname);
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
				<SubmitUserReportButton />
			</div>
		</AppShell>
	);
}
