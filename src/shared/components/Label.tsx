import { ReactNode } from 'react';

import clsx from 'clsx';

import Icon from '../ui/Icon';

type LabelProps = {
	children: ReactNode; // 텍스트 + 아이콘 자유 조합
	variant?: 'default' | 'tag'; // 스타일 모드
	onRemove?: () => void; // tag 모드에서 제거
};

export const Label = ({
	children,
	variant = 'default',
	onRemove,
}: LabelProps) => {
	return (
		<span
			className={clsx(
				'inline-flex items-center gap-1',
				variant === 'default' && 'text-sm font-medium text-gray-800',
				variant === 'tag' &&
					'px-2 py-1 rounded-full bg-gray-100 text-sm text-gray-700',
			)}
		>
			{children}
			{variant === 'tag' && onRemove && (
				<button
					type="button"
					onClick={onRemove}
					className="ml-1 text-gray-500 hover:text-gray-700"
				>
					<Icon name={'Cancel'} />
				</button>
			)}
		</span>
	);
};
