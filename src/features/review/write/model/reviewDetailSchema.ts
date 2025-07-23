import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const reviewDetailSchema = z.object({
	reviewDetail: z.string().max(100, '100자 이하로 입력해주세요.').optional(),
});

export type ReviewFormValues = z.infer<typeof reviewDetailSchema>;

export const useReviewForm = () =>
	useForm<ReviewFormValues>({
		resolver: zodResolver(reviewDetailSchema),
		mode: 'onChange',
	});
