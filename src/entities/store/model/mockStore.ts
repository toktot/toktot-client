// mockHome.ts (또는 mockStore.ts)
export interface Store {
	id: number;
	storeName: string;
	mainMenu?: string;
	reviewCount?: number;
	valueScore?: number;
	topPercent?: string;
	address: string;
	storeImageUrl: string;
	isKindStore: boolean;
	isLocal: boolean;
	distance: string;
	rating: number;
	mealTime: string;
	moods: string[];

	menuPrices?: {
		name: string;
		price: number;
	}[];
	position?: { lat: number; lng: number };
	startTime?: string;
	endTime?: string;
	phoneNumber?: string;
	ratingNumber?: number;
	cleanrating?: number;
	servicerating?: number;
	foodrating?: number;
	price?: number[]; // 가격 관련 옵션
	food?: number[]; // 음식 관련 옵션
	service?: number[]; // 서비스 관련 옵션
	clean?: number[]; // 청결 관련 옵션
	mood?: number[]; // 분위기 관련 옵션
	parking?: number[]; // 주차 관련 옵션
	writer?: string;
	time?: string;
	parkplace?: string;
	mainMenus?: string[];
}
export const mockStores = [
	{
		id: 1,
		storeName: '제주돔베고기집',
		mainMenu: '돔베고기',
		address: '서귀포시 노형동',
		startTime: '12:00',
		endTime: '19:00',
		phoneNumber: '123-4567-4457',
		ratingNumber: 4,
		cleanrating: 5.2,
		servicerating: 5.2,
		foodrating: 4.2,
		storeImageUrl: '/images/foodImage1.png',
		rating: 4.3,
		isLocal: true,
		isKindStore: true,
		distance: '234m',
		mealTime: '아침',
		moods: ['착한가게'],
		price: [1],
		service: [1],
		food: [1, 3],
		clean: [1, 3],
		mood: [1, 3],
		parking: [2],
		menuPrices: [{ name: '돔베고기', price: 40000 }],
		writer: '곰담놈',
		time: '1분 전',
		position: { lat: 37.511225, lng: 127.059708 },
		parkplace: '제주시 특별자치도, 원노현남길 16 지하 1층',
		reviewCount: 40,
		valueScore: 20,
		topPercent: '상위 20%',
		mainMenus: ['돔베고기', '고기국수'],
	},
	{
		id: 2,
		storeName: '돔베고기 원조집',
		mainMenu: '돔베고기',
		address: '서귀포시 대정읍 88-1',
		storeImageUrl: '/images/mockReview2.jpg',
		rating: 3,
		distance: '240m',
		mealTime: '아침',
		moods: ['로컬'],
		price: [1],
		isKindStore: false,
		isLocal: false,
		service: [1],
		food: [1, 3],
		reviewCount: 40,
		valueScore: 20,
		topPercent: '하위 20%',
		clean: [1, 3],
		mood: [1, 3],
		parking: [2],
		menuPrices: [
			{ name: '돔베고기', price: 40000 },
			{ name: '돔베고기 대', price: 25000 },
		],
		position: { lat: 33.31, lng: 33.31 },
		mainMenus: ['돔베고기', '고기국수', '옥돔'],
	},
];
