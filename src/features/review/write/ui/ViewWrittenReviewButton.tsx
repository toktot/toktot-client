'use client';

import { useRouter } from 'next/navigation';

import PrimaryButton from '@/shared/components/PrimaryButton';
import { ReviewId } from '@/shared/model/types';

interface ViewWrittenReviewButtonProps {
	reviewId: ReviewId;
}

export const ViewWrittenReviewButton = ({
	reviewId,
}: ViewWrittenReviewButtonProps) => {
	console.log('🚀 ~ ViewWrittenReviewButton ~ reviewId:', reviewId);
	const router = useRouter();

	const handleClick = () => {
		// FIXME: 리뷰 보기 구현 시 변경 router.push(`/review/${reviewId}`);
		router.push(`/home`);
	};

	return (
		<PrimaryButton
			className="w-full"
			text="작성한 리뷰 보기"
			onClick={handleClick}
		/>
	);
};
