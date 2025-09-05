import ky, { Options } from 'ky';
import toast from 'react-hot-toast';

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

const handleAuthRequired = (loginPath: string, alertMessage: string) => {
	toast.error(alertMessage);
	window.location.href = loginPath;
};

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
					// 토큰은 있지만 만료되었거나 유효하지 않은 경우
					if (response.status === 401) {
						onAuthError?.(401);
						handleAuthRequired(
							loginPath,
							'인증이 만료되었습니다. 다시 로그인해주세요.',
						);
					}
				},
			],
		},
	});

	return instance;
};
