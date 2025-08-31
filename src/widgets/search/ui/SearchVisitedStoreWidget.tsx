'use client';

import { useEffect, useState } from 'react';

import { useReviewImageManager } from '@/entities/review';
import { useRouter } from 'next/navigation';

import ContinueOrNewReviewModal from '@/features/review/write/ui/ContinueOrNewReviewModal';

import Typography from '@/shared/ui/Typography';

export const SearchVisitedStoreWidget = () => {
	const router = useRouter();
	const [showContinueModal, setShowContinueModal] = useState(false);
	const { initializeImages, clearImages, images } = useReviewImageManager(1);

	useEffect(() => {
		const checkExistingSession = async () => {
			await initializeImages();
		};
		checkExistingSession();
	}, [initializeImages]);

	useEffect(() => {
		if (images.length > 0) {
			setShowContinueModal(true);
		}
	}, [images]);

	const handleStartNew = () => {
		clearImages();
		setShowContinueModal(false);
		// FIXME: 임시 라우팅 처리
		router.push('/review/write/831');
	};

	const handleContinue = () => {
		setShowContinueModal(false);
		router.push('/review/write/831');
	};

	return (
		<section className="w-full space-y-3">
			<Typography as="h3">
				방문한 가게를
				<br /> 검색해주세요
			</Typography>
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				{showContinueModal && (
					<ContinueOrNewReviewModal
						onStartNew={handleStartNew}
						onContinue={handleContinue}
					/>
				)}
			</div>
		</section>
	);
};
