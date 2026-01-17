'use client';

import { useEffect, useRef, useState } from 'react';

import { KEYWORDS_BY_CATEGORY } from '@/entities/keyword/config/data';
import { useReviewImageManager } from '@/entities/review';
import { StoreData } from '@/entities/store';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewImageWidget, VisitedStoreWidget } from '@/widgets/review/write';
import { KeywordSelectionWidget } from '@/widgets/review/write/ui/KeywordSelectionWidget';

import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { useStore } from '@/features/review/write/hooks/useStore';
import ContinueOrNewReviewModal from '@/features/review/write/ui/ContinueOrNewReviewModal';

import { StoreId } from '@/shared/model/types';

import { MealTimeSelectionWidget } from './MealTimeSelectionWidget';
import { NextButton } from './NextButton';

interface ReviewWriteContentProps {
	storeId: StoreId;
}
export function ReviewWriteContent({ storeId }: ReviewWriteContentProps) {
	const [showContinueModal, setShowContinueModal] = useState(false);
	const {
		clearImages,
		initializeImages,
		hasExistingSession,
		setExistingSessionHandled,
	} = useReviewImageManager(storeId);
	const { store } = useStore(storeId);
	const initialCheckDone = useRef(false);

	useEffect(() => {
		const checkSession = async () => {
			if (!initialCheckDone.current) {
				await initializeImages();
				initialCheckDone.current = true;
			}
		};
		checkSession();
	}, [initializeImages]);

	useEffect(() => {
		if (hasExistingSession) {
			setShowContinueModal(true);
		}
	}, [hasExistingSession]);

	const handleStartNew = () => {
		clearImages();
		setExistingSessionHandled();
		setShowContinueModal(false);
	};

	const handleContinue = () => {
		setExistingSessionHandled();
		setShowContinueModal(false);
	};

	return (
		<AppShell showBottomNav={false}>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>
					<span className="leading-[48px]">리뷰 쓰기</span>
				</Header.Center>
			</Header>
			{showContinueModal && store && (
				<ContinueOrNewReviewModal
					onStartNew={handleStartNew}
					onContinue={handleContinue}
					store={store as StoreData}
					onClose={() => {
						setExistingSessionHandled();
						setShowContinueModal(false);
					}}
				/>
			)}
			<div className="flex flex-col items-center p-4 gap-9">
				<VisitedStoreWidget storeId={storeId} />
				<ReviewImageWidget restaurantId={storeId} />
				<KeywordSelectionWidget
					title="음식"
					category="food"
					keywords={KEYWORDS_BY_CATEGORY.food}
				/>
				<KeywordSelectionWidget
					title="청결"
					category="cleanliness"
					keywords={KEYWORDS_BY_CATEGORY.cleanliness}
				/>
				<KeywordSelectionWidget
					title="가격"
					category="price"
					keywords={KEYWORDS_BY_CATEGORY.price}
				/>
				<KeywordSelectionWidget
					title="서비스"
					category="service"
					keywords={KEYWORDS_BY_CATEGORY.service}
				/>
				<KeywordSelectionWidget
					title="분위기"
					category="atmosphere"
					keywords={KEYWORDS_BY_CATEGORY.atmosphere}
				/>
				<KeywordSelectionWidget
					title="접근성"
					category="accessibility"
					keywords={KEYWORDS_BY_CATEGORY.accessibility}
				/>
				<MealTimeSelectionWidget
					title="식사 시간"
					category="mealtime"
					keywords={KEYWORDS_BY_CATEGORY.mealtime}
				/>
				<div className="w-full sticky bottom-2">
					<NextButton restaurantId={storeId} />
				</div>
			</div>
		</AppShell>
	);
}
