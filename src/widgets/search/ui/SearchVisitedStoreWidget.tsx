'use client';

import { useEffect, useState } from 'react';

import { useReviewImageManager } from '@/entities/review';
import { StoreData } from '@/entities/store';

import { useStore } from '@/features/review/write/hooks/useStore';
import ContinueOrNewReviewModal from '@/features/review/write/ui/ContinueOrNewReviewModal';

import { StoreId } from '@/shared/model/types';

export const SearchVisitedStoreWidget = ({
	restaurantId,
}: {
	restaurantId: StoreId;
}) => {
	const [showContinueModal, setShowContinueModal] = useState(false);
	const { clearImages, images } = useReviewImageManager(restaurantId);
	const { store } = useStore(restaurantId);

	useEffect(() => {
		if (images.length > 0) {
			setShowContinueModal(true);
		}
	}, [images]);

	const handleStartNew = () => {
		clearImages();
		setShowContinueModal(false);
	};

	const handleContinue = () => {
		setShowContinueModal(false);
	};

	if (!store) {
		return <div className="p-4"></div>;
	}

	const storeDataForDisplay: StoreData & { distance: number } = {
		id: store.id as StoreId,
		storeName: store.storeName,
		address: store.address,
		storeImageUrl: store.storeImageUrl || '',
		mainMenu: store.mainMenu,
		distance: 0,
	};

	return (
		<section className="w-full space-y-3">
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				{showContinueModal && (
					<ContinueOrNewReviewModal
						onStartNew={handleStartNew}
						onContinue={handleContinue}
						store={storeDataForDisplay}
					/>
				)}
			</div>
		</section>
	);
};
