import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { reviewDetailSchema } from './reviewDetailSchema';

export type ReviewFormValues = z.infer<typeof reviewDetailSchema>;

export function useReviewForm() {
	return useForm<ReviewFormValues>({
		resolver: zodResolver(reviewDetailSchema),
		defaultValues: {
			reviewDetail: '',
		},
		mode: 'onChange',
	});
}
