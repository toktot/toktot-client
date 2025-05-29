import { Coordinates } from '../model/types';

export function panToPosition(map: kakao.maps.Map, coords: Coordinates) {
	if (!map || !coords) return;
	const target = new kakao.maps.LatLng(coords.lat, coords.lng);

	map.panTo(target);
}
