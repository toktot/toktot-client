'use client';

type PrimaryButtonProps = {
	text?: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	textColorWhenEnabled?: string;
	bgColorWhenEnabled?: string;

	disabledColor?: string;

	children?: React.ReactNode;
};

const PrimaryButton = ({
	text,
	onClick,
	disabled = false,
	type = 'button',
	className = '',
	textColorWhenEnabled = 'text-primary-40',
	bgColorWhenEnabled = 'bg-grey-90',

	children,

	disabledColor = 'bg-grey-40 text-grey-60 cursor-not-allowed',
}: PrimaryButtonProps) => {
	const baseClass = `h-[48px] rounded-[20px] font-semibold `;
	const enabledClass = `${bgColorWhenEnabled} ${textColorWhenEnabled}`;
	const disabledClass = `${disabledColor}`;
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type={type}
			className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${className}`}
		>
			{children || text}
		</button>
	);
};

export default PrimaryButton;
