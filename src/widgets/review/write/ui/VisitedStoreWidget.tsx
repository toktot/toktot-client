'use client';

import { type StoreData } from '@/entities/store';

import { useStore } from '@/features/review/write/hooks/useStore';

import { StoreId } from '@/shared/model/types';
import Typography from '@/shared/ui/Typography';

import ReviewStore from '../../read/ui/ReviewStore';

interface VisitedStoreWidgetProps {
	storeId: StoreId;
}

export const VisitedStoreWidget = ({ storeId }: VisitedStoreWidgetProps) => {
	const { store, isLoading, error } = useStore(storeId);

	if (isLoading) {
		return <div className="p-4">가게 정보를 불러오는 중...</div>;
	}

	if (error) {
		return <div className="p-4 text-red-500">오류: {error}</div>;
	}

	if (!store) {
		return <div className="p-4">가게 정보를 찾을 수 없습니다.</div>;
	}

	const storeDataForDisplay: StoreData & { distance: number } = {
		id: store.id as StoreId,
		storeName: store.storeName,
		address: store.address,
		storeImageUrl: store.storeImageUrl || '/images/mockReview.jpg',
		mainMenu: store.mainMenu,
		distance: 0,
	};

	return (
		<section className="w-full space-y-3">
			<Typography as="h3">방문한 가게</Typography>
			<div className="bg-grey-10 text-grey-80 rounded-xl">
				<ReviewStore store={storeDataForDisplay} />
			</div>
		</section>
	);
};
