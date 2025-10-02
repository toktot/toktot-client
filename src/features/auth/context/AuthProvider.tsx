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
	login: (
		username: string,
		password: string
	) => Promise<{ success: boolean; message?: string; errorCode?: string }>;
	logout: () => void;
	deleteAccount: () => Promise<{ success: boolean; message?: string }>;
	
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	console.log('authProvider 렌더링 시작')
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		console.log('AuthProvider useEffect실행')
		const token = getDecryptedToken();
		const storedUser = getUser();

		if (token && storedUser) setUser(storedUser);
	}, []);

	const loginHandler = async (
		email: string,
		password: string,
	): Promise<{success: boolean; message?: string; errorCode?: string}> => {
		console.log('호출')
		try {
			const res = await fetch('https://api.toktot.site/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			console.log('HTTP status', res.status);
			const data = await res.json();
			console.log('Raw login response:', data);

			
    if (!data.success) {
      return {
        success: false,
        message: data.message,
        errorCode: data.errorCode,
      };
    }
			console.log('login response', data);
			const accessToken = data.data.access_token;

			setEncryptedToken(accessToken);

			return {success:true};
		} catch (error) {
			console.error('Login error:', error);
			return {success: false, message:'로그인 중 오류 발생'}
		}
	};

	const logoutHandler = () => {
		removeToken();
		removeUser();
		setUser(null);
		router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
	};
	const deleteAccountHandler = async () : Promise<{success: boolean; message?: string}> => {
		try {
			const token = getDecryptedToken();
			const res = await fetch('https://api.toktot.site/v1/users/me', {
				method: 'DELETE',
				headers : {
					'Authorization' : `Bearer ${token}`
				}
			})
			const data = await res.json();

			if (!data.success) {
				return {success: false, message : data.message};
			}
			removeToken();
			removeUser();
			setUser(null);
			router.push('/login');

			return {success : true, message : '회원 탈퇴 성공'}
		} catch (error) {
			console.log('error',error)
			return {success: false, message : '회원 탈퇴 중 오류'}
		}
	}

	return (
		<AuthContext.Provider
			value={{ user, login: loginHandler, logout: logoutHandler,
				deleteAccount : deleteAccountHandler
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
