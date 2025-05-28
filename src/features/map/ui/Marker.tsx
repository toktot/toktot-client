import { useEffect, useState } from 'react';

import { useMarkerClick } from '../model/useMarkerClick';

interface MarkerProps {
	map: kakao.maps.Map;
	position: { lat: number; lng: number };
	onClick?: () => void;
}

export function Marker({ map, position, onClick }: MarkerProps) {
	const [marker, setMarker] = useState<kakao.maps.Marker | null>(null);
	useMarkerClick({ marker, onClick: onClick || (() => {}) });

	useEffect(() => {
		if (!map) return;

		const instance = new kakao.maps.Marker({
			map,
			position: new kakao.maps.LatLng(position.lat, position.lng),
		});
		setMarker(instance);

		return () => {
			instance.setMap(null);
		};
	}, [map, position]);

	return null;
}
