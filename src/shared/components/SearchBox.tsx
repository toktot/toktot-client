'use client';

import type { ReactNode } from 'react';

import Icon from '@/shared/ui/Icon';

interface Props {
	query: string;
	onChange: (value: string) => void;
	onSearchClick: () => void;
	onFocus?: () => void;
	rightElement?: ReactNode;
	className?: string;
	placeholder?: string;
}

export default function SearchBox({
	query,
	onChange,
	onSearchClick,
	onFocus,

	className,
	placeholder,
}: Props) {
	const isFilled = query.trim().length > 0;

	return (
		<div className="relative w-[343px] mx-auto transition-all duration-300">
			<button
				type="button"
				onClick={onSearchClick}
				className={`absolute top-1/2 -translate-y-1/2 transition-all z-10 ${
					isFilled ? 'right-4' : 'left-4'
				}`}
			>
				<Icon name={'Search'} size="s" className={'text-primary-40'} />
			</button>

			<input
				type="text"
				placeholder={placeholder}
				value={query}
				onFocus={onFocus}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full h-[44px] pl-10 pr-10 py-[11px] rounded-[18px] border text-sm outline-none transition-all bg-grey-10
					placeholder-gray-400 border-[#ccc] text-gray-800 ${className || ''}
          ${isFilled ? 'text-primary-60 border-primary-60' : 'text-grey-60 border-[#ccc]'}`}
			/>
		</div>
	);
}
