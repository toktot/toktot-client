'use client';

import clsx from 'clsx';

import { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

interface GasimbiTagProps {
	value: number;
	className?: string;
}

export default function GasimbiTag({ value, className }: GasimbiTagProps) {

	if (!Number.isFinite(value) || value  <= 0) return null;
	let valueColor = 'text-green-500';
	let iconName: IconName = 'None';

	if (value >= 80) {
		valueColor = 'text-green-500';
		iconName = 'greenHeart';
	} else if (value >= 50) {
		valueColor = 'text-blue-500';
		iconName = 'orangeHeart';
	} else if (value >= 30) {
		valueColor = 'text-orange-500';
		iconName = 'GasimbiHeart';
	}

	return (
		<div
			className={clsx(
				'flex items-center rounded-md bg-grey-90 py-[3px]',
				className,
			)}
		>
			<Icon name={iconName} className="ml-1" size="xs" />
			<span className="px-1 text-[9px] mr-1">
				<span className={`${valueColor} text-[11px]`}>{value}점</span>
			</span>
		</div>
	);
}
