'use client';

import clsx from 'clsx';

interface StoreCategoryTagProps {
	type: '착한가게' | '로컬';
	className?: string;
}

export default function StoreCategoryTag({ type }: StoreCategoryTagProps) {
	const color =
		type === '착한가게'
			? 'bg-green-100 text-green-800'
			: 'bg-priamary-10 text-primary-50';

	return (
		<span
			className={clsx('px-1.5 py-0.5 rounded-full text-xs font-medium', color)}
		>
			{type}
		</span>
	);
}
