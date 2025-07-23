import { mockUser } from '@/entities/user/model/mockUser';

export const login = (username: string, password: string) => {
	if (username === mockUser.username && password === mockUser.password) {
		return { token: 'fake-jwt-token', user: mockUser };
	}
	return null;
};
