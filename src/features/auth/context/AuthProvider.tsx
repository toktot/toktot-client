'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
	getDecryptedToken,
	getUser,
	removeToken,
	removeUser,
	setEncryptedToken,
} from '@/shared/utils/storage';

import { User } from '../../../entities/user/types/auth';

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		const token = getDecryptedToken();
		const storedUser = getUser();

		if (token && storedUser) setUser(storedUser);
	}, []);

	const loginHandler = async (
		email: string,
		password: string,
	): Promise<boolean> => {
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await res.json();

			if (!data.success || !data.data?.access_token) {
				return false;
			}
			console.log('login response', data);
			const accessToken = data.data.access_token;

			setEncryptedToken(accessToken);

			return true;
		} catch (error) {
			console.error('Login error:', error);
			return false;
		}
	};

	const logoutHandler = () => {
		removeToken();
		removeUser();
		setUser(null);
		router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
	};

	return (
		<AuthContext.Provider
			value={{ user, login: loginHandler, logout: logoutHandler }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};
