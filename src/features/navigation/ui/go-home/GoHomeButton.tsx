'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

export const GoHomeButton = () => {
	const router = useRouter();

	const handleClick = () => {
		router.push('/');
	};

	return (
		<SecondaryButton
			className="border-grey-50 text-grey-90"
			text="홈으로 돌아가기"
			onClick={handleClick}
		/>
	);
};

type SecondaryButtonProps = {
	text: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	textColorWhenEnabled?: string;
	borderColorWhenEnabled?: string;
	bgColorWhenEnabled?: string;
};

const SecondaryButton = ({
	text,
	onClick,
	disabled = false,
	type = 'button',
	className = '',
	textColorWhenEnabled = 'text-primary-90',
	borderColorWhenEnabled = 'border-primary-90',
	bgColorWhenEnabled = 'bg-white',
}: SecondaryButtonProps) => {
	const baseClass = `h-[48px] rounded-[20px] font-semibold text-[18px] border`;
	const enabledClass = `${bgColorWhenEnabled} ${textColorWhenEnabled} ${borderColorWhenEnabled}`;
	const disabledClass = 'bg-grey-20 text-grey-50 border-grey-40';
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type={type}
			className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${className}`}
		>
			{text}
		</button>
	);
};
