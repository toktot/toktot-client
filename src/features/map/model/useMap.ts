import { useEffect, useState } from 'react';

import { DEFAULT_CENTER } from '@/shared/location/model/constants';

import { loadKakaoMap } from '../lib/loadKakaoMap';
import { DEFAULT_LEVEL } from './mapConfig';

type MapInitOptions = {
	center?: { lat?: number; lng?: number };
	level?: number;
};

export function useMap(containerId: string, options: MapInitOptions = {}) {
	const [map, setMap] = useState<kakao.maps.Map | null>(null);

	useEffect(() => {
		loadKakaoMap().then(() => {
			const container = document.getElementById(containerId);
			if (!container) return;

			const mapOptions = {
				center: new kakao.maps.LatLng(
					options.center?.lat ?? DEFAULT_CENTER.lat,
					options.center?.lng ?? DEFAULT_CENTER.lng,
				),
				level: options.level ?? DEFAULT_LEVEL,
			};

			const kakaoMap = new kakao.maps.Map(container, mapOptions);
			setMap(kakaoMap);
		});
	}, [containerId, options.center?.lat, options.center?.lng, options.level]);

	return map;
}
