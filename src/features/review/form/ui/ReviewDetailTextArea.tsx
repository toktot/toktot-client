'use client';

import { useState } from 'react';

import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

export const ReviewDetailTextArea = () => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();
	const review = watch('reviewDetail') ?? '';
	const maxLength = 100;
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div className="relative w-full">
			<textarea
				{...register('reviewDetail')}
				placeholder="상세 리뷰를 입력해주세요."
				maxLength={maxLength}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				className={clsx(
					'w-full h-[140px] rounded-[18px] pr-14 pb-6 px-5 py-4 resize-none text-sm outline-none transition-colors duration-150 border',
					isFocused ? 'text-primary-60' : 'text-black',
					errors.review
						? 'border-red-500 focus:border-red-500'
						: 'border-gray-300 focus:border-primary-30',
				)}
			/>
			<span
				className={clsx(
					'pointer-events-none absolute bottom-4 right-5 text-xs transition-colors duration-150',
				)}
			>
				<span className={clsx(isFocused ? 'text-primary-60' : 'text-gray-600')}>
					{review.length}
				</span>
				{` / ${maxLength}`}
			</span>
		</div>
	);
};
