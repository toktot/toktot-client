import ky, { Options } from 'ky';

const baseOptions: Options = {
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10_000,
};

export const publicApi = ky.create({ ...baseOptions });

export const createAuthApi = (opts?: {
	getToken?: () => string | undefined;
	onAuthError?: (status: number) => void;
}) => {
	const instance = ky.create({
		...baseOptions,
		hooks: {
			beforeRequest: [
				(request) => {
					const token = opts?.getToken?.();
					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					}
				},
			],
			afterResponse: [
				async (_request, _options, response) => {
					if (response.status === 401) {
						opts?.onAuthError?.(401);
					}
				},
			],
		},
	});

	return instance;
};
