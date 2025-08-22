'use client';

import clsx from 'clsx';

import { useReport } from '../../model/useReport';

interface ReportReviewButtonProps {
	reviewId: number;
	snippet: string;
	className?: string;
}

export const ReportReviewButton = ({
	reviewId,
	snippet,
	className,
}: ReportReviewButtonProps) => {
	const { handleReportClick, isLoading } = useReport(
		'review',
		reviewId,
		snippet,
	);

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
