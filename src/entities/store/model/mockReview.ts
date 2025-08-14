import { mockUser } from '@/entities/user/model/mockUser';

export interface Reviews {
	id: string;
	auth: {
		nickname: string;
		profileImageUrl?: string;
	};
	image: string;
	menu: string[]; // 수정됨
	date: string; // YYYY-MM-DD
	mealTime: string;
	type?: string;
	rating?: string;
	text?: string;
}

export const mockReviews: Reviews[] = [
	{
		id: '1',
		auth: mockUser[0],
		image: '/images/foodImage1.png',
		menu: ['돔베고기'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		type: '서비스',
		rating: '4',
		text: '아 진짜 너무 더럽고요 이게 뭔지 모르겠어요',
	},
	{
		id: '2',
		auth: mockUser[1],
		image: '/images/foodImage1.png',
		menu: ['돔베고기'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		type: '음식',
		rating: '4',
		text: '아 진짜 너무 더럽고요 이게 뭔지 모르겠어요',
	},
	{
		id: '3',
		auth: mockUser[2],
		image: '/images/foodImage1.png',
		menu: ['고기국수'],
		date: '2025-08-05T14:30:00', // 시간 정보 포함
		mealTime: '점심',
		type: '청결',
		rating: '4',
		text: '아 진짜 너무 더럽고요 이게 뭔지 모르겠어요',
	},
];
