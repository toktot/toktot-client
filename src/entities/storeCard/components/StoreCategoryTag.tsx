'use client';

import clsx from 'clsx';

import Icon from '@/shared/ui/Icon';

interface StoreCategoryTagProps {
	type: '착한가게' | '로컬';
	className?: string;
}

export default function StoreCategoryTag({ type }: StoreCategoryTagProps) {
	const color =
		type === '착한가게'
			? 'bg-green-500 text-white'
			: 'bg-priamary-10 text-primary-50';

	return (
		<div className="flex flex-wrap">
			<span
				className={clsx(
					'inline-flex items-center rounded-md font-medium',
					'px-1 py-[3px] text-[9px]',
					color,
				)}
			>
				{type === '착한가게' && <Icon name="GoodPrice" className="w-3 h-3" />}
				{type}
			</span>
		</div>
	);
}
