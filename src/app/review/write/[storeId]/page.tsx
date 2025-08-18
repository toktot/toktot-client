import { StoreData } from '@/entities/store';

import { ReviewWriteContent } from '@/widgets/review/write/ui/ReviewWriteContent';

import { StoreId } from '@/shared/model/types';

async function getVisitedStoreData(
	storeId: StoreId,
): Promise<StoreData & { distance: number }> {
	// const store = await fetchStoreFromDB(storeId);
	// const distance = await calculateDistanceToUser(store.coords);

	return {
		id: storeId,
		storeName: '오감 만족 족발 & 보쌈',
		mainMenu: '반반 족발 세트',
		address: '서울시 강남구 테헤란로 427',
		storeImageUrl: '/images/mockReview.jpg',
		distance: 400, // 거리 정보 포함
	};
}

type Params = Promise<{ storeId: string }>;

export default async function ReviewWritePage({ params }: { params: Params }) {
	const { storeId } = await params;
	const visitedStoreData = await getVisitedStoreData(storeId as StoreId);

	return (
		<ReviewWriteContent storeId={storeId} visitedStoreData={visitedStoreData} />
	);
}
