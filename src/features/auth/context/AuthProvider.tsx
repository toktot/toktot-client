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
import { logoutUserApi } from '../api/api';
import { LoginResponse } from '../components/LoginForm';

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<LoginResponse>;
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
	): Promise<LoginResponse> => {
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			const data: LoginResponse = await res.json();

			if (data.success && data.data?.access_token) {
				setEncryptedToken(data.data.access_token);
			}

			return data;
		} catch (error) {
			console.error('Login error:', error);
			return {
				success: false,
				message: '로그인 실패',
				data: { access_token: '', token_type: '', expires_in: 0 },
			};
		}
	};

	const logoutHandler = async () => {
		try {
			await logoutUserApi();
		} finally {
			// API 호출 성공 여부와 관계없이 클라이언트에서는 항상 로그아웃 처리
			removeToken();
			removeUser();
			setUser(null);
			router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
		}
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
