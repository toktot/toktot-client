import clsx from 'clsx';

import Icon from '@/shared/ui/Icon';

interface AuthorScoreLabelProps {
	score: number;
}

const getScoreStyles = (score: number) => {
	if (score >= 70) {
		// 70-100: Green
		return 'bg-sub-green-50 border-[#00C79F]';
	}
	if (score >= 31) {
		// 31-69: Blue
		return 'bg-[#3AC8FF] border-primary-40';
	}
	// 0-30: Orange
	return 'bg-sub-orange-50 border-[#FFB885]';
};

export const AuthorScoreLabel = ({ score }: AuthorScoreLabelProps) => {
	const scoreClasses = getScoreStyles(score);

	return (
		<div
			className={clsx(
				'flex items-center shrink-0 gap-[2px] px-[6px] rounded-md border text-white',
				scoreClasses,
			)}
		>
			<Icon name={'GasimbiHeart'} />
			<span className="font-semibold text-xs leading-none">{score + '점'}</span>
		</div>
	);
};
