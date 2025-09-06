'use client';

import clsx from 'clsx';

import Icon, { IconProps } from '@/shared/ui/Icon';

type CategoryTagProps = {
	label: string;
	text: string;
	className?: string;
};

const labelToIcon: Record<string, IconProps['name']> = {
	음식: 'Star',
	서비스: 'Service',
	청결: 'Clear',
};

const CategoryTag = ({ label, text, className }: CategoryTagProps) => {
	const iconName = labelToIcon[label];
	const colorMap: Record<string, { fill: string; border: string }> = {
		Service: { fill: '#11BB69', border: '#11BB69' },
		Clear: { fill: '#FF893A', border: '#FF893A' },
		Star: { fill: '#38DEFF', border: '#38DEFF' },
	};

	const { fill } = colorMap[iconName] || {
		fill: '#999999',
		border: '#999999',
	};

	return (
		<div
			className={clsx(
				'flex items-center gap-0.5 rounded-md px-2 py-0 bg-white',
				className,
			)}
		>
			<Icon name={iconName} fill={fill} color={fill} size="xxs" />
			<span className="text-[11px] text-grey-80">{text}</span>
		</div>
	);
};

export default CategoryTag;
