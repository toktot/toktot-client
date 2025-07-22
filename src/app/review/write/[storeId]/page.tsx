import { ReviewedMenuItemData } from '@/entities/menu';
import { StoreData } from '@/entities/store';

import {
	RegisteredMenuListWidget,
	ReviewImageWidget,
	ReviewMoodFilterWidget,
	VisitedStoreWidget,
} from '@/widgets/review/write';

const ReviewMenuList: ReviewedMenuItemData[] = [
	{
		id: crypto.randomUUID(),
		name: '불고기',
		price: 12000,
		servings: 2,
		rating: 3,
	},
	{
		id: crypto.randomUUID(),
		name: '삼겹살',
		price: 15000,
		servings: 1,
		rating: 4,
	},
];

async function getVisitedStoreData(
	storeId: string,
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

async function ReviewWritePage({ params }: { params: { storeId: string } }) {
	const visitedStoreData = await getVisitedStoreData(params.storeId);

	return (
		<div className="h-dvh flex flex-col items-center p-4 gap-9">
			<VisitedStoreWidget store={visitedStoreData} />
			<ReviewImageWidget />
			<RegisteredMenuListWidget menuList={ReviewMenuList} />
			<ReviewMoodFilterWidget />
		</div>
	);
}

export default ReviewWritePage;
