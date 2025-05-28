import { DEFAULT_CENTER } from '../model/mapConfig';

type Coordinates = { lat?: number; lng?: number };

export function panToPosition(map: kakao.maps.Map, coords: Coordinates) {
	if (!map) return;

	const lat = coords?.lat ?? DEFAULT_CENTER.lat;
	const lng = coords?.lng ?? DEFAULT_CENTER.lng;

	const target = new kakao.maps.LatLng(lat, lng);

	map.panTo(target);
}
