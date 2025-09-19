'use client';

import clsx from 'clsx';

import { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface TopPercentTagProps {
	value: string | number; // "상위 20%" 같은 string
	className?: string;
}

export default function TopPercentTag({
	value,
	className,
}: TopPercentTagProps) {
	const strValue = String(value);
	const [position] = strValue.split(' ');

	let wrapperBg = '';
	let iconName: IconName = 'Gasimbi';

	if (position === '상위') {
		wrapperBg = 'bg-green-100 text-grey-90';
		iconName = 'GreenGasimbi';
	} else if (position === '중간') {
		wrapperBg = 'bg-blue-100 text-grey-90';
		iconName = 'Gasimbi';
	} else {
		wrapperBg = 'bg-orange-100 text-grey-90';
		iconName = 'OrangeGasimbi';
	}

	return (
		<div
			className={clsx(
				'flex items-center rounded-md px-1 py-1 text-[9px] font-medium gap-1',
				wrapperBg,
				className,
			)}
		>
			<Icon name={iconName} size="xs" />
			<span className="font-semibold text-[11px] ">{value}%</span>
		</div>
	);
}
