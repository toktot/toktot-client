export interface Review {
	id: number;
	imageUrl: string;
	placeName: string;
	location: string;
	distance: string;
	rating?: number;
	mealTime?: string;
	moods?: string[];
	mainMenu?: string;
	startTime?: string;
	endTime?: string;
	phoneNumber?: string;
	ratingNumber?: number;
	cleanrating?: number;
	servicerating?: number;
	foodrating?: number;
	cleanNumber?: number;
	serviceNumber?: number;
	foodNumber?: number;
	position?: { lat: number; lng: number };
}

export const mockHome: Review[] = [
	{
		id: 1,
		imageUrl: '/images/foodImage1.png',
		placeName: '다요이네 삼밥',
		location: '제주시 특별자치도, 원노형남1길 16 1층',
		distance: '100m',
		mealTime: '아침',
		startTime: '10:00',
		endTime: '20:00',
		rating: 4.3,
		moods: ['로컬', '오션뷰'],
		phoneNumber: '123 - 4567 - 4457',
		ratingNumber: 23,
		cleanNumber: 5,
		foodNumber: 23,
		serviceNumber: 16,
		cleanrating: 5.2,
		servicerating: 4.2,
		foodrating: 5.2,
		position: { lat: 37.511225, lng: 127.059708 },
	},
	{
		id: 2,
		imageUrl: '/images/foodImage2.png',
		placeName: '다운이네 쌈밥',
		location: '서귀포시 종구',
		distance: '1km',
		mealTime: '아침',
		rating: 4.3,
		moods: ['로컬', '오션뷰'],
	},
	{
		id: 3,
		imageUrl: '/images/foodImage3.png',
		placeName: '다운이네 쌈밥',
		location: '서귀포시 중구',
		distance: '거리',
		mealTime: '아침',
		rating: 4.3,
		moods: ['로컬', '오션뷰'],
	},
	{
		id: 4,
		imageUrl: '/images/foodImage4.png',
		placeName: '다운이네 쌈밥',
		location: '서귀포시 중구',
		distance: '거리',
		mealTime: '아침',
		rating: 4.3,
		moods: ['로컬', '오션뷰'],
	},
];
