'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { mockUser } from '@/entities/user/model/mockUser';

import {
	getDecryptedToken,
	getUser,
	removeToken,
	removeUser,
	setEncryptedToken,
} from '@/shared/utils/storage';

import { User } from '../types/auth';

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => boolean;
	logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const token = getDecryptedToken();
		const storedUser = getUser();
		if (token && storedUser) setUser(storedUser);
	}, []);

	const loginHandler = (username: string, password: string) => {
		const storedUser = getUser();
		if (
			(username === mockUser.username && password === mockUser.password) ||
			(storedUser && username === storedUser.username)
		) {
			const token = getDecryptedToken() ?? 'kakao-token';
			setEncryptedToken(token);
			setUser(storedUser ?? mockUser);
			return true;
		}
		return false;
	};

	const logoutHandler = () => {
		removeToken();
		removeUser();
		setUser(null);
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
