import ky, { Options } from 'ky';
import toast from 'react-hot-toast';

import { getDecryptedToken } from '@/shared/utils/storage';

import { refreshToken } from './auth';

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

	'TOKEN_INVALID',
	'LOGIN_REQUIRED',
	'KAKAO_LOGIN_FAILED',
	'KAKAO_TOKEN_INVALID',
]);

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const createAuthApi = (opts?: AuthApiOptions) => {
	const {
		getToken = getDecryptedToken,
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

						throw new Error('Authentication token is not available.');
					}
				},
			],
			afterResponse: [
				async (request, _options, response) => {
					const body = await response
						.clone()
						.json()
						.catch(() => null);
					const isTokenExpired =
						(body?.errorCode === 'TOKEN_EXPIRED' && body?.success === false) ||
						response.status === 401;

					if (isTokenExpired) {
						if (!isRefreshing) {
							isRefreshing = true;

							refreshPromise = refreshToken().finally(() => {
								isRefreshing = false;
							});
						}

						try {
							const newToken = await refreshPromise;
							if (newToken) {
								request.headers.set('Authorization', `Bearer ${newToken}`);
								return ky(request);
							}

							throw new Error('Failed to refresh token');
						} catch (error) {
							console.error(error);
							onAuthError?.(401);
							handleAuthRequired(
								loginPath,
								'인증이 만료되었습니다. 다시 로그인해주세요.',
							);

							return new Response(JSON.stringify(body), {
								status: response.status,
							});
						}
					}

					if (
						body &&
						body.success === false &&
						body.errorCode &&
						AUTH_ERRORS.has(body.errorCode)
					) {
						await handleAuthRequired(
							loginPath,
							body.message ?? '로그인이 필요한 서비스입니다.',
						);

						return Promise.reject(
							new Error(body.message || 'Authentication error'),
						);
					}

					return response;
				},
			],
		},
	});

	return instance;
};
