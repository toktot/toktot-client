import { KEYWORDS_BY_CATEGORY } from '@/entities/keyword/config/data';
import { StoreData } from '@/entities/store';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewImageWidget, VisitedStoreWidget } from '@/widgets/review/write';
import { KeywordSelectionWidget } from '@/widgets/review/write/ui/KeywordSelectionWidget';
import { ReviewMoodFilterWidget } from '@/widgets/review/write/ui/ReviewMoodFilterWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

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
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<div className="flex flex-col items-center p-4 gap-9">
				<VisitedStoreWidget store={visitedStoreData} />
				<ReviewImageWidget />
				<ReviewMoodFilterWidget />
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
			</div>
		</AppShell>
	);
}
