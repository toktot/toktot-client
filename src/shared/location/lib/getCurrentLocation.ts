import { GetCurrentLocationOptions } from '../model/types';

export const getCurrentLocation = (
	options: GetCurrentLocationOptions,
): Promise<GeolocationPosition> => {
	if (!navigator.geolocation) {
		return Promise.reject(
			new Error('이 브라우저는 위치 정보를 지원하지 않아요.'),
		);
	}

	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
};
