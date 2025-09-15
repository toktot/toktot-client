'use client';

import { createAuthApi } from '@/shared/api';
import { getDecryptedToken } from '@/shared/utils/storage';

const api = createAuthApi({ getToken: () => getDecryptedToken() ?? undefined });

/**
 * 서버에 로그아웃 요청을 보냅니다.
 * @returns Promise<void>
 */
export const logoutUserApi = async (): Promise<void> => {
	try {
		await api.post('v1/logout').json();
	} catch (error) {
		// 서버 로그아웃이 실패하더라도 클라이언트에서는 로그아웃을 계속 진행해야 하므로,
		// 에러를 던지는 대신 콘솔
		console.error('Server logout failed:', error);
	}
};
