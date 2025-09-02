'use client';

import type { CSSProperties, ReactNode } from 'react';

interface Props {
	query: string;
	onChange: (value: string) => void;
	onSearchClick: () => void;
	onFocus?: () => void;
	onClick?: () => void;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	style?: CSSProperties;
	leftIconPosition?: 'left' | 'right'; // 기본 left
	rightIconPosition?: 'left' | 'right'; // 기본 right
	leftIconOnClick?: () => void;
	rightIconOnClick?: () => void;

	borderColor?: string; // tailwind 또는 css color 문자열
	textColor?: string;
	placeholderColor?: string;

	className?: string;
	placeholder?: string;
}

export default function SearchBox({
	query,
	onChange,
	onSearchClick,
	onFocus,
	onClick,
	placeholderColor,
	leftIcon,
	rightIcon,
	leftIconOnClick,
	rightIconOnClick,
	leftIconPosition = 'left',
	rightIconPosition = 'right',
	style,
	className = '',
	placeholder = '',
}: Props) {
	const inputPaddingLeft =
		leftIcon && leftIconPosition === 'left' ? 'pl-12' : 'pl-4';
	const inputPaddingRight =
		leftIcon && leftIconPosition === 'right' ? 'pr-12' : 'pr-4';

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSearchClick();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`relative transition-all duration-300 rounded-[18px] ${className}`}
			style={style}
		>
			{leftIcon && (
				<button
					type="button"
					onClick={leftIconOnClick ?? onSearchClick}
					className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${leftIconPosition === 'left' ? 'left-4' : 'right-4'} text-grey-50`}
					tabIndex={-1}
				>
					{leftIcon}
				</button>
			)}
			{rightIcon && (
				<button
					type="button"
					onClick={rightIconOnClick}
					className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${rightIconPosition === 'right' ? 'right-4' : 'left-4'}`}
					tabIndex={-1}
				>
					{rightIcon}
				</button>
			)}
			<input
				type="text"
				placeholder={placeholder}
				onClick={onClick}
				value={query}
				onFocus={onFocus}
				onChange={(e) => onChange(e.target.value)}
				className={`w-full h-full  border-none outline-none bg-transparent ${inputPaddingLeft} ${inputPaddingRight} ${placeholderColor}`}
			/>
		</form>
	);
}
