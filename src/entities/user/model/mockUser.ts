import { User } from '../types/auth';

export const mockUser: User[] = [
	{
		id: 1,
		username: 'testUser',
		password: '1234',
		nickname: '테스트 유저',
		profileImageUrl: '/images/user1',
		reviewCount: 2,
		averageRating: 3,
		gasimbi: 80,
	},
	{
		id: 2,
		username: 'testUser',
		password: '1234',
		nickname: '독똣',
		profileImageUrl: '/images/user1',
		reviewCount: 2,
		averageRating: 3,
		gasimbi: 20,
	},
	{
		id: 3,
		username: 'testUser',
		password: '1234',
		nickname: '입니당',
		profileImageUrl: '/images/user1',
		reviewCount: 2,
		averageRating: 3,
		gasimbi: 30,
	},
];
