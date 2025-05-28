import { useCallback, useEffect, useState } from 'react';

import type { Location } from '../model/types';
import { getCurrentLocation } from './getCurrentLocation';

export const useCurrentLocation = () => {
	const [location, setLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchLocation = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const position = await getCurrentLocation({
				enableHighAccuracy: true,
				maximumAge: 0,
				timeout: 5000,
			});

			const { timestamp, coords } = position;

			setLocation({
				timestamp,
				coords: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					altitude: coords.altitude,
					accuracy: coords.accuracy,
					altitudeAccuracy: coords.altitudeAccuracy,
					heading: coords.heading,
				},
			});
		} catch (e) {
			console.info('❌ 위치 가져오기 실패', e);
			setError(
				e instanceof Error ? e.message : '위치 정보를 가져올 수 없어요.',
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLocation();
	}, [fetchLocation]);

	return { location, loading, error, reloadLocation: fetchLocation };
};
