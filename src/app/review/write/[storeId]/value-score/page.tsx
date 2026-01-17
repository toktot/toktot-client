'use client';

import { useState } from 'react';

import { useReviewImageManager } from '@/entities/review';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { AppShell, Header } from '@/widgets/layout';
import { buildSubmitPayload } from '@/widgets/review/write/lib/buildSubmitPayload';
import { ReviewSubmitButton } from '@/widgets/review/write/ui/ReviewSubmitButton';

import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { createWriteReviewApi } from '@/features/review/write/api/api';
import { useKeywordStore } from '@/features/review/write/model/useKeywordStore';
import { useReviewWriteStore } from '@/features/review/write/model/useReviewWriteStore';
import { ValueScoreInput } from '@/features/review/write/ui/ValueScoreInput';

import { createAuthApi } from '@/shared/api';
import { StoreId } from '@/shared/model/types';
import { getDecryptedToken } from '@/shared/utils/storage';

export default function ValueScorePage() {
	const params = useParams();
	const router = useRouter();
	const restaurantId = Number(params.storeId);

	const [isLoading, setIsLoading] = useState(false);
	const imageManager = useReviewImageManager(params.storeId as StoreId);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const payload = buildSubmitPayload(restaurantId, imageManager.images);

			const api = createWriteReviewApi(
				createAuthApi({ getToken: () => getDecryptedToken() ?? undefined }),
			);
			const { review_id } = await api.submitReview(payload);

			useReviewWriteStore.getState().clearAllState();
			useKeywordStore.getState().clearAllKeywords();
			await imageManager.clearImages();

			router.push(`/review/write/complete?reviewId=${review_id}`);
		} catch (error) {
			console.error('Review submission error:', error);
			toast.error(
				error instanceof Error ? error.message : '리뷰 제출에 실패했습니다.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center justify-between flex-1 p-4"
			>
				<ValueScoreInput />
				<div className="w-full p-4">
					<ReviewSubmitButton isLoading={isLoading} />
				</div>
			</form>
		</AppShell>
	);
}
