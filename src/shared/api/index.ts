import ky, { Options } from 'ky';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { ApiResponseSchema } from '@/shared/api/schema';

const BaseResponseSchema = ApiResponseSchema(z.unknown());

const baseOptions: Options = {
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10_000,
};

export const publicApi = ky.create({ ...baseOptions });

interface AuthApiOptions {
	getToken?: () => string | undefined;
	onAuthError?: (status: number) => void;
	loginPath?: string;
	alertMessage?: string;
}

const handleAuthRequired = async (loginPath: string, alertMessage: string) => {
	toast.error(alertMessage, { id: 'auth-error', duration: 2000 });
	await new Promise((resolve) => setTimeout(resolve, 2000));
	window.location.href = loginPath;
};

const AUTH_ERRORS = new Set([
	'INVALID_PASSWORD',
	'USER_NOT_FOUND',
	'TOKEN_EXPIRED',
	'TOKEN_INVALID',
	'LOGIN_REQUIRED',
	'KAKAO_LOGIN_FAILED',
	'KAKAO_TOKEN_INVALID',
]);

export const createAuthApi = (opts?: AuthApiOptions) => {
	const {
		getToken,
		onAuthError,
		loginPath = '/login',
		alertMessage = '로그인이 필요한 서비스입니다.',
	} = opts || {};

	const instance = ky.create({
		...baseOptions,
		hooks: {
			beforeRequest: [
				(request) => {
					const token = getToken?.();

					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					} else {
						handleAuthRequired(loginPath, alertMessage);
						throw new Error('Authentication required');
					}
				},
			],

			afterResponse: [
				async (_request, _options, response) => {
					try {
						debugger;
						const cloned = await response.clone().json();
						const parsed = BaseResponseSchema.safeParse(cloned);

						if (!parsed.success) {
							return;
						}

						const data = parsed.data;
						console.log('🚀 ~ createAuthApi ~ data:', data);
						if (
							data.success === false &&
							data.errorCode &&
							AUTH_ERRORS.has(data.errorCode)
						) {
							await handleAuthRequired(
								loginPath,
								data.message ?? '로그인이 필요한 서비스입니다.',
							);
							return Promise.reject(new Error('인증 오류'));
						}
					} catch {
						return;
					}

					if (response.status === 401) {
						onAuthError?.(401);
						handleAuthRequired(
							loginPath,
							'인증이 만료되었습니다. 다시 로그인해주세요.',
						);
						throw new Error('401 Unauthorized');
					}
				},
			],
		},
	});

	return instance;
};
