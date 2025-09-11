import { createReviewStatisticsApi } from '@/entities/review/api/statistics';
import ky from 'ky';

import { getDecryptedToken } from '@/shared/utils/storage';

export const reviewStatisticsApi = createReviewStatisticsApi(
	ky.create({
		prefixUrl: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		hooks: {
			beforeRequest: [
				(request) => {
					const token = getDecryptedToken();
					if (token) {
						request.headers.set('Authorization', `Bearer ${token}`);
					}
				},
			],
		},
	}),
);
