// GasimbiTag.tsx
'use client';

import clsx from 'clsx';

// GasimbiTag.tsx

// GasimbiTag.tsx

// GasimbiTag.tsx

interface GasimbiTagProps {
	value: number;
	className?: string;
}

export default function GasimbiTag({ value, className }: GasimbiTagProps) {
	let valueColor = 'text-green-500';

	if (value >= 80) valueColor = 'text-green-500';
	else if (value >= 50) valueColor = 'text-blue-500';
	else if (value >= 30) valueColor = 'text-orange-500';

	return (
		<div
			className={clsx('flex items-center rounded-full bg-grey-10', className)}
		>
			<span className="px-1 py-1 text-[9px]">
				<span className="text-grey-90">가심비</span>{' '}
				<span className={valueColor}>{value}점</span>
			</span>
		</div>
	);
}
