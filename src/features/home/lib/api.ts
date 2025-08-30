import axios from 'axios';
// Next.js에서 토큰 쿠키 가져오기
import { redirect } from 'next/navigation';

import { getDecryptedToken } from '@/shared/utils/storage';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL, // .env에 API 주소 넣어두기
	withCredentials: true, // 쿠키 같이 보내려면 true
});

// 요청 인터셉터
api.interceptors.request.use(
	(config) => {
		const token = getDecryptedToken(); // 쿠키/스토리지에서 토큰 꺼내기
		console.log(token);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// 토큰 만료 or 로그인 안 함
			// 클라이언트에서 강제 리다이렉트
			if (typeof window !== 'undefined') {
				window.location.href = '/login';
			} else {
				redirect('/login');
			}
		}
		return Promise.reject(error);
	},
);

export default api;
