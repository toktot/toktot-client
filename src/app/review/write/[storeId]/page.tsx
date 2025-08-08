import { ReviewedMenuItemData } from '@/entities/menu';
import { StoreData } from '@/entities/store';

import { AppShell } from '@/widgets/layout';
import {
	RegisteredMenuListWidget,
	ReviewImageWidget,
	ReviewMoodFilterWidget,
	VisitedStoreWidget,
} from '@/widgets/review/write';

import { MenuItemId, StoreId } from '@/shared/model/types';

const ReviewMenuList: ReviewedMenuItemData[] = [
	{
		id: 'mock-menu-bulgogi' as MenuItemId,
		name: '불고기',
		price: 12000,
		servings: 2,
		rating: 3,
	},
	{
		id: 'mock-menu-samgyeopsal' as MenuItemId,
		name: '삼겹살',
		price: 15000,
		servings: 1,
		rating: 4,
	},
];

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
		<AppShell headerTitle={`리뷰 쓰기`} showBottomNav={false}>
			<div className="flex flex-col items-center p-4 gap-9">
				<VisitedStoreWidget store={visitedStoreData} />
				<ReviewImageWidget />
				<RegisteredMenuListWidget menuList={ReviewMenuList} />
				<ReviewMoodFilterWidget />
			</div>
		</AppShell>
	);
}
