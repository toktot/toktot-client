'use client';

import clsx from 'clsx';

interface CustomCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	'aria-label': string;
}

export const CustomCheckbox = ({
	checked,
	onChange,
	'aria-label': ariaLabel,
}: CustomCheckboxProps) => {
	return (
		<label className="relative inline-block h-5 w-5 cursor-pointer">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="peer absolute h-0 w-0 opacity-0"
				aria-label={ariaLabel}
			/>
			<div
				className={clsx(
					'w-5 h-5 rounded-full outline outline-offset-[-0.5px] transition-colors',
					checked ? 'outline-primary-50' : 'outline-grey-60 bg-grey-10',
					'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-50 peer-focus-visible:ring-offset-2',
				)}
			>
				{checked && (
					<div className="absolute left-[3px] top-[3px] h-3.5 w-3.5 rounded-full bg-primary-50" />
				)}
			</div>
		</label>
	);
};
