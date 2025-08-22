'use client';

import Typography from '@/shared/ui/Typography';

import { useUserReportStore } from '../../model/useUserReportStore';

export const ReportTargetDisplay = () => {
	const targetNickname = useUserReportStore((state) => state.targetNickname);

	return (
		<section className="w-full space-y-3">
			<Typography as="h4">신고 대상</Typography>
			<span className="text-xs text-grey-50 space-y-2">닉네임</span>
			<div className="w-full p-4 bg-grey-20 rounded-2xl text-grey-80 h-12 flex items-center">
				{targetNickname || '사용자 정보 없음'}
			</div>
		</section>
	);
};
