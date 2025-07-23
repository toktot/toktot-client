'use client';

import { FormProvider } from 'react-hook-form';

import { useReviewForm } from '../model/useReviewForm';
import type { ReviewFormValues } from '../model/useReviewForm';
import { ReviewDetailTextArea } from '../ui/ReviewDetailTextArea';

export const ReviewForm = () => {
	const methods = useReviewForm();
	const { watch, handleSubmit } = methods;
	const review = watch('reviewDetail') ?? '';

	const onSubmit = (data: ReviewFormValues) => {
		console.log('제출됨:', data);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ReviewDetailTextArea />
				<button
					type="submit"
					disabled={review.trim().length === 0}
					className="mt-4 rounded px-4 py-2 text-white transition-colors duration-200
              disabled:bg-gray-300 disabled:text-gray-500
              bg-primary-60 hover:bg-primary-70"
				>
					제출
				</button>
			</form>
		</FormProvider>
	);
};
