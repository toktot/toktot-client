'use client';

import { User } from '../../entities/user/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const setEncryptedToken = (token: string) => {
	const encoded = btoa(token);
	localStorage.setItem(TOKEN_KEY, encoded);
};

export const getDecryptedToken = (): string | null => {
	const encoded = localStorage.getItem(TOKEN_KEY);
	return encoded ? atob(encoded) : null;
};

export const removeToken = () => {
	localStorage.removeItem(TOKEN_KEY);
};

export const setUser = (user: User) => {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const getUser = (): User | null => {
	try {
		const userData = localStorage.getItem(USER_KEY);
		if (!userData || userData === 'undefined') return null;
		return JSON.parse(userData);
	} catch (e) {
		console.error('getUser() JSON parse error:', e);
		return null;
	}
};

export const removeUser = () => {
	localStorage.removeItem(USER_KEY);
};
export const getKakaoLoginUrl = (): string => {
	const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
	const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
	const clientSecret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
	if (!clientId || !redirectUri) {
		throw new Error(
			'Kakao clientId or redirectUri is not defined in environment variables',
		);
	}

	const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize');
	kakaoAuthUrl.searchParams.set('client_id', clientId);
	kakaoAuthUrl.searchParams.set('redirect_uri', redirectUri);
	kakaoAuthUrl.searchParams.set('response_type', 'code');
	if (clientSecret) {
		kakaoAuthUrl.searchParams.set('client_secret', clientSecret);
	}

	return kakaoAuthUrl.toString();
};
