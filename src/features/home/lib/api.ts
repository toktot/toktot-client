import axios from 'axios';
// Next.js에서 토큰 쿠키 가져오기
import { redirect } from 'next/navigation';

import { getDecryptedToken } from '@/shared/utils/storage';

import { refreshToken } from '../../../shared/api/auth';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL, // .env에 API 주소 넣어두기
	withCredentials: true, // 쿠키 같이 보내려면 true
});

// 요청 인터셉터
api.interceptors.request.use(
	(config) => {
		const token = getDecryptedToken(); // 쿠키/스토리지에서 토큰 꺼내기

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
}
// 응답 인터셉터
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const { config, response } = error;
		if (response?.status === 401 && !config._retry) {
			config._retry = true;

			if (!isRefreshing) {
				isRefreshing = true;
				const newToken = await refreshToken();
				isRefreshing = false;

				if (newToken) {
					onRefreshed(newToken);
					config.headers.Authorization = `Bearer ${newToken}`;
					return api(config);
				} else {
					if (typeof window !== 'undefined') {
						window.location.href = '/login';
					} else {
						redirect('/login');
					}
				}
			}
			return new Promise((resolve) => {
				refreshSubscribers.push((token: string) => {
					config.headers.Authorization = `Bearer ${token}`;
					resolve(api(config));
				});
			});
		}
		return Promise.reject(error);
	},
);

export default api;
