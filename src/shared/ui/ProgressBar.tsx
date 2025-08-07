'use client';

import clsx from 'clsx';

interface ProgressBarProps {
	total: number;
	current: number;
	activeColor?: string;
	inactiveColor?: string;
}

/**
 * @description 전체 아이템 개수와 현재 위치 시각적으로 나타냅니다.
 */
export const ProgressBar = ({
	total,
	current,
	activeColor = 'bg-grey-10',
	inactiveColor = 'bg-grey-70',
}: ProgressBarProps) => {
	if (total <= 0) {
		return null;
	}

	return (
		<div className="flex items-center w-full gap-1">
			{Array.from({ length: total }).map((_, index) => {
				const isActive = index === current;

				return (
					<div
						key={index}
						className="h-1 flex-grow rounded-full transition-colors duration-300"
					>
						<div
							className={clsx(
								'h-full rounded-full',
								isActive ? activeColor : inactiveColor,
							)}
						/>
					</div>
				);
			})}
		</div>
	);
};
