'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const detailedReviewSchema = z.object({
	detailedText: z.string().max(100, '리뷰는 100자 이하로 작성해주세요.'),
});

type DetailedReviewFormValues = z.infer<typeof detailedReviewSchema>;

interface DetailedReviewStepProps {
	onComplete: (detailedText: string) => void;
}

export const DetailedReviewStep = ({ onComplete }: DetailedReviewStepProps) => {
	const methods = useForm<DetailedReviewFormValues>({
		resolver: zodResolver(detailedReviewSchema),
		defaultValues: {
			detailedText: '',
		},
		mode: 'onChange',
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = methods;

	const detailedText = watch('detailedText');
	const maxLength = 100;

	const onValidSubmit = (data: DetailedReviewFormValues) => {
		onComplete(data.detailedText);
	};

	return (
		<FormProvider {...methods}>
			<form
				id="step-form"
				onSubmit={handleSubmit(onValidSubmit)}
				className="space-y-3"
			>
				<div>
					<h2 className="text-lg font-bold">상세 리뷰</h2>
				</div>

				<div className="relative w-full">
					<textarea
						// register 함수로 react-hook-form에 등록합니다.
						{...register('detailedText')}
						placeholder="리뷰에 대해 입력해주세요."
						maxLength={maxLength}
						className={clsx(
							'w-full h-[140px] rounded-[18px] pr-14 pb-6 px-5 py-4 resize-none text-sm outline-none transition-colors duration-150 border text-primary-60 placeholder:text-gray-400',
							errors.detailedText
								? 'border-red-500 focus:border-red-500'
								: 'border-gray-300 focus:border-primary-30',
						)}
					/>
					<div className="absolute bottom-4 right-5 text-xs text-gray-400">
						<span className="text-primary-60">{detailedText.length}</span>
						<span> / {maxLength}</span>
					</div>
				</div>

				{/* 유효성 검사 에러 메시지를 표시합니다. */}
				{errors.detailedText && (
					<p className="text-xs text-red-500 mt-1">
						{errors.detailedText.message}
					</p>
				)}
			</form>
		</FormProvider>
	);
};

export default DetailedReviewStep;
