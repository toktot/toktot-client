import { mockUser } from '@/entities/user/model/mockUser';

export interface Reviews {
	id: number;

	auth: {
		id?: number;
		nickname: string;
		profileImageUrl?: string;
		reviewCount?: number;
		averageRating?: number;
	};
	image: string;
	images: {
		id: number;
		imageUrl: string;
		menus: { menuName: string; totalPrice: number }[];
	}[];
	menu: string[]; // 수정됨
	date: string; // YYYY-MM-DD
	mealTime: string;
	type: string;
	rating: number;
	gasimbi?: number;
	popular?: number;
	textString?: string;
	text?: {
		service?: [id: number, rating: number, texts: string];
		food?: [id: number, rating: number, texts: string];
		clean?: [id: number, rating: number, texts: string];
	};
	categories: {
		service?: number[];
		food?: number[];
		clean?: number[];
	};
	isCurrent?: boolean;
	averagegasimbi?: number;
	satisfaction?: number;
	normal?: number;
	bad?: number;
}

export const mockReviews: Reviews[] = [
	{
		id: 1,
		auth: mockUser[0],
		image: '/images/foodImage1.png',
		menu: ['돔베고기'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		type: '서비스',
		rating: 4,
		text: {
			food: [
				1,
				4.5,
				'음식이 맛도 없고 너무 매움 매운정도는 한.......불닭는ㅇㄴㅇㅇ낌>>> ??? ',
			],
			clean: [1, 4.2, '테이블이 깨끗해요'],
			service: [1, 3.6, '음식 나오는 속도가 좀 느려요'],
		},
		popular: 20,
		images: [
			{
				id: 1,
				imageUrl: '',
				menus: [{ menuName: '돔베고기', totalPrice: 2000 }],
			},
		],

		gasimbi: 80,
		categories: {
			service: [1],
		},
	},
	{
		id: 2,
		auth: mockUser[1],
		image: '/images/foodImage1.png',
		menu: ['돔베고기'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		type: '서비스',
		images: [
			{
				id: 1,
				imageUrl: '',
				menus: [{ menuName: '돔베고기', totalPrice: 2000 }],
			},
		],
		rating: 4,

		popular: 30,
		categories: {
			service: [2],
		},
	},
	{
		id: 3,
		auth: mockUser[2],
		image: '/images/foodImage1.png',
		menu: ['고기국수'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		images: [
			{
				id: 1,
				imageUrl: '',
				menus: [{ menuName: '돔베고기', totalPrice: 2000 }],
			},
		],
		type: '청결',
		rating: 4,

		popular: 40,
		categories: {
			service: [1, 2],
		},
	},
];
