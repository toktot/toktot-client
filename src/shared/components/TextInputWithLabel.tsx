'use client';

import { forwardRef } from 'react';

export type TextInputWithLabelProps = {
	label?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	inputClassName?: string;
	labelClassName?: string;
	maxLength?: number;
	className?: string;
	placeholderClassName?: string;
};

const TextInputWithLabel = forwardRef<
	HTMLInputElement,
	TextInputWithLabelProps
>(
	(
		{
			label,
			value,
			onChange,
			placeholder = '',
			type = 'text',
			inputClassName = '',
			labelClassName = '',
			maxLength,
			className,
			placeholderClassName = '',
		},
		ref,
	) => {
		const textColor = value.trim() !== '' ? 'text-grey-90' : 'text-grey-60';
		return (
			<div className="flex flex-col gap-[10px] w-[296px] h-[62px]">
				<label className={` ${labelClassName}`}>{label}</label>
				<input
					ref={ref}
					type={type}
					maxLength={maxLength}
					className={`${className}
           
            h-[38px]
            rounded-[10px] 
            pt-[17px] pr-[20px] pb-[17px] pl-[20px] 
          
            
            bg-grey-10
           
            outline-none
           ${placeholderClassName}
        
            ${textColor}
            ${inputClassName}
          `}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
				/>
			</div>
		);
	},
);

TextInputWithLabel.displayName = 'TextInputWithLabel';

export default TextInputWithLabel;
