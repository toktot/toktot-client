// mockHome.ts (또는 mockStore.ts)
export interface Store {
	id: number;
	storeName: string;
	mainMenu: string;
	address: string;
	storeImageUrl: string;
	isKindStore: boolean;
	isLocal: boolean;
	distance: string;
	mealTime: string;
	moods: string[];
	rating?: number;
	price?: number[]; // 가격 관련 옵션
	food?: number[]; // 음식 관련 옵션
	service?: number[]; // 서비스 관련 옵션
	clean?: number[]; // 청결 관련 옵션
	mood?: number[]; // 분위기 관련 옵션
	parking?: number[]; // 주차 관련 옵션
}
export const mockStores = [
	{
		id: '1',
		storeName: '제주돔베고기집',
		mainMenu: '돔베고기',
		address: '서귀포시 노형동',
		storeImageUrl: '/images/foodImage1.png',
		rating: 4.3,
		isLocal: true,
		isKindStore: true,
		distance: '234',
		mealTime: '아침',
		moods: ['로컬'],
		price: [1],
		service: [1],
		food: [1, 3],
		clean: [1, 3],
		mood: [1, 3],
		parking: [2],
	},
	{
		id: '2',
		storeName: '돔베고기 원조집',
		mainMenu: '돔베고기',
		address: '서귀포시 대정읍 88-1',
		storeImageUrl: '/images/mockReview2.jpg',
		rating: 3,
		distance: '240',
		mealTime: '아침',
		moods: ['로컬'],
		price: [1],
		service: [1],
		food: [1, 3],
		clean: [1, 3],
		mood: [1, 3],
		parking: [2],
	},
];
