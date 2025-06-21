import type { Coordinates } from '@/shared/location/model/types';

export function createPolygon(
	coords: Coordinates[],
	options?: Partial<kakao.maps.PolygonOptions>,
) {
	const path = coords.map((c) => new kakao.maps.LatLng(c.lat, c.lng));

	return new kakao.maps.Polygon({
		path,
		strokeWeight: 2,
		strokeColor: 'skyblue',
		strokeOpacity: 0.8,
		strokeStyle: 'solid',
		fillColor: '#67E6FF',
		fillOpacity: 0.4,
		...options,
	});
}
