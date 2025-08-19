'use client';

import clsx from 'clsx';

import { useReportUser } from '../model/useReportUser';

interface ReportUserButtonProps {
	userId: number;
	nickname: string;
	className?: string;
}

export const ReportUserButton = ({
	userId,
	nickname,
	className,
}: ReportUserButtonProps) => {
	const { handleReportClick, isLoading } = useReportUser(userId, nickname);

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
