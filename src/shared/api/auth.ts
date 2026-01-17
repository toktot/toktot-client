// shared/api/auth.ts
import api from '@/widgets/home/lib/api';

import {
	removeToken,
	removeUser,
	setEncryptedToken,
} from '@/shared/utils/storage';

export const refreshToken = async () => {
	try {
		const res = await api.post('/v1/auth/refresh', {}); // body는 비어있음
		if (res.data.success) {
			const { access_token } = res.data.data;
			// 새 access token 저장
			setEncryptedToken(access_token);
			return access_token;
		} else {
			// 실패 -> 토큰/유저 정보 제거
			removeToken();
			removeUser();
			return null;
		}
	} catch (e) {
		console.error('토큰 갱신 실패:', e);
		removeToken();
		removeUser();
		return null;
	}
};
