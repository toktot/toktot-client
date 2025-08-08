'use client';

import { useState } from 'react';

import { ReviewId } from '@/shared/model/types';

export const useSaveReview = () => {
	const [isPending, setIsPending] = useState(false);

	const mutate = async (reviewId: ReviewId) => {
		setIsPending(true);
		console.log(`Saving review: ${reviewId}`);

		await new Promise((resolve) => setTimeout(resolve, 500));

		console.log(`Review ${reviewId} saved successfully!`);
		setIsPending(false);
	};

	return { mutate, isPending };
};
