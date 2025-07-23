'use client';

import { useRouter } from 'next/navigation';

import PrimaryButton from '@/shared/components/PrimaryButton';

interface ViewWrittenReviewButtonProps {
	reviewId: string;
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
