'use client';

import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import Typography from '@/shared/ui/Typography';

import { useReviewWriteStore } from '../model/useReviewWriteStore';

const scoreSchema = z
	.object({
		d1: z
			.string()
			.regex(/^[0-1]$/, '첫 번째 자리는 0 또는 1만 입력할 수 있습니다.'),
		d2: z.string().regex(/^[0-9]$/, '숫자만 입력 가능합니다.'),
		d3: z.string().regex(/^[0-9]$/, '숫자만 입력 가능합니다.'),
	})
	.refine((data) => parseInt(`${data.d1}${data.d2}${data.d3}`) <= 100, {
		message: '100 이하의 값만 입력할 수 있습니다.',
		path: ['d1'],
	});
type ScoreFormValues = z.infer<typeof scoreSchema>;

export const ValueScoreInput = () => {
	const setValueForMoneyScore = useReviewWriteStore(
		(state) => state.setValueForMoneyScore,
	);

	const {
		register,
		control,
		setFocus,
		formState: { errors, isValid },
	} = useForm<ScoreFormValues>({
		resolver: zodResolver(scoreSchema),
		mode: 'onChange',
		defaultValues: { d1: '', d2: '', d3: '' },
	});

	const digits = useWatch({ control });
	useEffect(() => {
		if (isValid) {
			const score = parseInt(`${digits.d1}${digits.d2}${digits.d3}`);
			setValueForMoneyScore(score);
		} else {
			setValueForMoneyScore(null);
		}
	}, [digits, isValid, setValueForMoneyScore]);

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		current: 'd1' | 'd2' | 'd3',
	) => {
		if (e.key === 'Backspace' && e.currentTarget.value === '') {
			if (current === 'd2') setFocus('d1');
			if (current === 'd3') setFocus('d2');
		}
	};

	const handleKeyUp = (
		e: React.KeyboardEvent<HTMLInputElement>,
		next: 'd2' | 'd3' | null,
	) => {
		if (e.currentTarget.value.length === 1 && next) {
			setFocus(next);
		}
	};

	return (
		<section className="w-full p-4 flex flex-col gap-12">
			<div>
				<p className="justify-center text-grey-70 text-sm">
					이제 마지막이에요.
				</p>
				<Typography as="h1">
					작성한 가게의
					<br /> 가심비를 알려주세요
				</Typography>
			</div>
			<div className="flex justify-center items-center gap-2">
				<input
					{...register('d1')}
					onKeyUp={(e) => handleKeyUp(e, 'd2')}
					onInput={(e) => {
						const target = e.currentTarget;
						target.value = target.value.replace(/[^01]/g, ''); // 0, 1만 허용
					}}
					tabIndex={0}
					maxLength={1}
					className="w-16 h-16 bg-grey-20 text-primary-50 rounded-2xl text-4xl text-center focus:border-2 focus:border-primary-40 
      focus:outline-none"
				/>
				<input
					{...register('d2')}
					onKeyUp={(e) => handleKeyUp(e, 'd3')}
					onKeyDown={(e) => handleKeyDown(e, 'd2')}
					tabIndex={1}
					onInput={(e) => {
						const target = e.currentTarget;
						if (digits.d1 === '1') {
							target.value = target.value.replace(/[^0]/g, '');
						} else {
							target.value = target.value.replace(/[^0-9]/g, '');
						}
					}}
					maxLength={1}
					className="w-16 h-16 bg-grey-20 text-primary-50 rounded-2xl text-4xl text-center focus:border-2 focus:border-primary-40 
      focus:outline-none"
				/>
				<input
					{...register('d3')}
					onKeyDown={(e) => handleKeyDown(e, 'd3')}
					tabIndex={2}
					onInput={(e) => {
						const target = e.currentTarget;
						if (digits.d1 === '1') {
							target.value = target.value.replace(/[^0]/g, '');
						} else {
							target.value = target.value.replace(/[^0-9]/g, '');
						}
					}}
					maxLength={1}
					className="w-16 h-16 bg-grey-20 text-primary-50 rounded-2xl text-4xl text-center focus:border-2 focus:border-primary-40 
      focus:outline-none"
				/>
			</div>
			{errors.d1 && <p className="text-red-500 text-sm">{errors.d1.message}</p>}
			<p className="text-xs text-gray-500 mt-2">
				0점부터 100점까지 입력 가능해요.
			</p>
		</section>
	);
};
