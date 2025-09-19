'use client';

import clsx from 'clsx';

import Icon from '@/shared/ui/Icon';

interface StoreCategoryTagProps {
	type: '착한가게' | '로컬';
	className?: string;
}

export default function StoreCategoryTag({
	type,
	className,
}: StoreCategoryTagProps) {
	const color =
		type === '착한가게'
			? 'bg-[#18C094] text-white'
			: 'bg-priamary-10 text-primary-50';

	return (
		<div className="flex flex-wrap">
			<span
				className={clsx(
					'inline-flex items-center font-medium',
					className,

					color,
				)}
			>
				{type === '착한가게' && <Icon name="GoodPrice" />}
				{type}
			</span>
		</div>
	);
}
