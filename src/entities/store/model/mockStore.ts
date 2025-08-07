// mockHome.ts (또는 mockStore.ts)
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
	},
];
