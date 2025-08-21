'use client';

import clsx from 'clsx';

import { useReport } from '../model/useReport';

interface ReportButtonProps {
	userId: number;
	nickname: string;
	className?: string;
}

export const ReportButton = ({
	userId,
	nickname,
	className,
}: ReportButtonProps) => {
	const { handleReportClick, isLoading } = useReport('user', userId, nickname);

	return (
		<button
			onClick={handleReportClick}
			disabled={isLoading}
			className={clsx(className, { loading: isLoading })}
		>
			{isLoading ? '확인 중...' : '신고하기'}
		</button>
	);
};
