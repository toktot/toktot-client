'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import {
	getDecryptedToken,
	getUser,
	removeToken,
	removeUser,
	setEncryptedToken,
} from '@/shared/utils/storage';

import { User } from '../../../entities/user/types/auth';
import { deleteUserApi, logoutUserApi } from '../api/api';
import { LoginResponse } from '../components/LoginForm';

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<LoginResponse>;
	logout: () => Promise<void>;
	deleteAccount: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

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
		await logoutUserApi();
		removeToken();
		removeUser();
		setUser(null);
	};

	const deleteAccountHandler = async () => {
		await deleteUserApi();
		removeToken();
		removeUser();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login: loginHandler,
				logout: logoutHandler,
				deleteAccount: deleteAccountHandler,
			}}
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
