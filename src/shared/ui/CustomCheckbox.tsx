'use client';

import clsx from 'clsx';

import Icon from './Icon';

interface CustomCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	'aria-label': string;
	disabled: boolean;
}

export const CustomCheckbox = ({
	checked,
	onChange,
	'aria-label': ariaLabel,
	disabled,
}: CustomCheckboxProps) => {
	return (
		<label className="relative inline-block h-5 w-5 cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={(e) => onChange(e.target.checked)}
				className="peer absolute h-0 w-0 opacity-0"
				aria-label={ariaLabel}
			/>
			<div
				className={clsx(
					'w-5 h-5 rounded-full outline outline-offset-[-0.5px] transition-colors flex items-center justify-center',
					'outline-grey-60 bg-grey-10',
				)}
			>
				<Icon
					name={'Checkmark'}
					size="m"
					className={clsx(
						'absolute transition-opacity',
						checked ? 'opacity-100 fill-primary-50 text-white' : 'opacity-0',
					)}
				/>
			</div>
		</label>
	);
};
