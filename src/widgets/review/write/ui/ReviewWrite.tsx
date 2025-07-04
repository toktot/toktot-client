import { ReviewedMenuItem } from '@/entities/review/model/menu';
import { VisitedStoreData } from '@/entities/review/model/store';
import VisitedStore from '@/entities/review/ui/VisitedStore';

import { RegisteredMenuList } from '@/features/review/write/ui/RegisteredMenuList';
import ReviewImageSection from '@/features/review/write/ui/ReviewImageSection';

const ReviewMenuList: ReviewedMenuItem[] = [
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

const store: VisitedStoreData = {
	storeName: '오감 만족 족발 & 보쌈',
	mainMenu: '반반 족발 세트',
	storeImageUrl: 'https://image.server.com/stores/og-jokbal/main.jpg',
	address: '서울시 강남구 테헤란로 427',
	distance: 400,
};

const ReviewWrite = () => {
	return (
		<>
			<VisitedStore store={store} />
			<ReviewImageSection />
			<RegisteredMenuList menuList={ReviewMenuList} />
		</>
	);
};

export default ReviewWrite;
