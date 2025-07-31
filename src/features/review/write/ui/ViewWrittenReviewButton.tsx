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
	const router = useRouter();

	const handleClick = () => {
		router.push(`/review/${reviewId}`);
	};

	return (
		<PrimaryButton
			className="w-full"
			text="작성한 리뷰 보기"
			onClick={handleClick}
		/>
	);
};
